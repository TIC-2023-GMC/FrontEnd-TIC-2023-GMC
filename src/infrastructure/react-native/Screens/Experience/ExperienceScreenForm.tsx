import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler, Text, View } from 'react-native';
import { Button, Divider, HelperText, RadioButton, TextInput, useTheme } from 'react-native-paper';
import PhotoSelection from '../../components/PhotoSelection';
import { SnackBarError } from '../../components/SnackBarError';

import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/user.auth';
import { CreateExperienceUseCase, UploadImageUseCase } from '../../../../application/hooks';
import { Photo, Publication } from '../../../../domain/models/InterfacesModels';
import { ExperiencePublicationSchema } from '../../../../domain/schemas/Schemas';
import { resetNavigationStack } from '../../../../utils/utils';
import { styles } from './ExperienceScreenForm.styles';
const createExperience = container.resolve(CreateExperienceUseCase);
const uploadImg = container.resolve(UploadImageUseCase);
export function ExperienceScreenForm() {
	const theme = useTheme();
	const navigation = useNavigation();
	const { user } = useContext<UserContextParams>(UserContext);
	const tabBarHeight = useBottomTabBarHeight();
	const [image, setImage] = useState<string>();
	const [failUpload, setFailUpload] = useState<string>('');

	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					resetNavigationStack(navigation, 'Experiencias');
					return true;
				}
				return false;
			};
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);
			return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		}, [])
	);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(ExperiencePublicationSchema),
		defaultValues: {
			_id: '',
			user: user,
			description: '',
			publication_date: new Date(),
			photo: {
				img_path: ''
			},
			likes: [],
			species: ''
		}
	});
	const resetForm = () => {
		reset();
		resetNavigationStack(navigation, 'Experiencias');
		setImage(undefined);
	};

	const { createPublicationMutation, loading, setLoading } =
		createExperience.useMutationExperiencePublication(resetForm);

	const onSubmit: SubmitHandler<Publication> = async (data) => {
		if (image) {
			setLoading(true);
			const new_photo: Photo = (await uploadImg.uploadImage(image, setFailUpload)) ?? ({} as Photo);
			const currentDateUTC = new Date();
			const timezoneOffset = currentDateUTC.getTimezoneOffset() * 60000;
			const currentDateLocal = new Date(currentDateUTC.getTime() - timezoneOffset);
			const new_publication: Publication = {
				...data,
				publication_date: currentDateLocal,
				photo: new_photo
			};
			createPublicationMutation.mutate(new_publication);
		}
	};
	return (
		<View style={{ ...styles.container, marginBottom: tabBarHeight }}>
			<PhotoSelection image={image} setImage={setImage} />
			{image === undefined && <HelperText type="error">La foto es requerida</HelperText>}
			<Text style={styles.text}>Especie:</Text>
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<>
						<RadioButton.Group onValueChange={onChange} value={value}>
							<View style={styles.viewList}>
								<RadioButton.Item
									position="leading"
									value="Perro"
									label="Perro"
									style={styles.radioButton}
									labelStyle={styles.labelRadioButton}
								/>
								<RadioButton.Item
									position="leading"
									value="Gato"
									label="Gato"
									style={styles.radioButton}
									labelStyle={styles.labelRadioButton}
								/>
							</View>
						</RadioButton.Group>
						{errors.species && <HelperText type="error">{errors.species.message}</HelperText>}
					</>
				)}
				name="species"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							textColor={theme.colors.shadow}
							placeholder="Ingrese su historia o experiencia"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Mi experiencia:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.description && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.description}
						/>
						{errors.description && (
							<HelperText type="error">{errors.description.message}</HelperText>
						)}
					</>
				)}
				name="description"
			/>
			{errors.user && (
				<HelperText type="error">
					NOTA: Debe completar los campos de &quot;Aptitud&quot; en su perfil para realizar
					publicaciones
				</HelperText>
			)}
			<View style={styles.buttonView}>
				<Button
					style={styles.button}
					mode="elevated"
					buttonColor={theme.colors.tertiary}
					textColor={theme.colors.secondary}
					onPress={() => {
						setImage(undefined);
						setLoading(false);
						reset();
						resetNavigationStack(navigation, 'Experiencias');
					}}
				>
					Cancelar
				</Button>
				<Button
					style={styles.button}
					mode="elevated"
					buttonColor={theme.colors.primary}
					textColor={theme.colors.secondary}
					onPress={handleSubmit(onSubmit)}
					loading={loading}
				>
					Publicar
				</Button>
			</View>
			<SnackBarError setFailUpload={setFailUpload} failUpload={failUpload} reset={reset} />
		</View>
	);
}
