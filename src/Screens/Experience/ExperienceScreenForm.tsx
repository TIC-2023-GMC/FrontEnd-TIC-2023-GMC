import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Divider, RadioButton, useTheme, Button, HelperText } from 'react-native-paper';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './ExperienceScreenForm.styles';
import PhotoSelection from '../../components/PhotoSelection';
import { ExperiencePublication, Photo } from '../../models/InterfacesModels';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TabNavigation } from '../../models/types';
import { ExperiencePublicationSchema } from '../../models/Schemas';
import { SnackBarError } from '../../components/SnackBarError';
import { uploadImg } from '../../utils/utils';
import { post } from '../../services/api';
import { UserContext, UserContextParams } from '../../auth/userContext';
import { getAddExperienceEndpoint } from '../../services/endpoints';

export function ExperienceScreenForm() {
	const theme = useTheme();
	const navigation = useNavigation<NavigationProp<TabNavigation>>();
	const { user } = useContext<UserContextParams>(UserContext);
	const tabBarHeight = useBottomTabBarHeight();
	const [image, setImage] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const [failUpload, setFailUpload] = useState<string>('');
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
			comments: [],
			species: ''
		}
	});

	const createPublicationMutation = useMutation({
		mutationFn: (data: ExperiencePublication) =>
			post(getAddExperienceEndpoint(), data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			navigation.navigate('Experiencias');
			reset();
			setImage(undefined);
		}
	});
	
	const onSubmit: SubmitHandler<ExperiencePublication> = async (data) => {
		if (image) {
			setLoading(true);
			const response_body = await uploadImg(image, setFailUpload);
			const response = JSON.parse(response_body ? response_body : '{}');
			const new_photo: Photo = {
				...response
			};
			const currentDateUTC = new Date();
			const timezoneOffset = currentDateUTC.getTimezoneOffset() * 60000;
			const currentDateLocal = new Date(currentDateUTC.getTime() - timezoneOffset);
			const new_publication: ExperiencePublication = {
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
						navigation.navigate('Experiencias');
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
