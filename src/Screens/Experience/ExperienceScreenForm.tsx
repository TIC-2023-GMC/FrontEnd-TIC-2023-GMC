import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

export function ExperienceScreenForm() {
	const theme = useTheme();
	const navigation = useNavigation<NavigationProp<TabNavigation>>();
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
			user: {
				_id: '1',
				first_name: 'Gandhy',
				last_name: 'García',
				mobile_phone: '0983473043',
				neighborhood: 'Cumbayá',
				email: 'gandhygarcia@outlook.es',
				password: 'password123',
				num_previous_pets: 2,
				num_current_pets: 1,
				outdoor_hours: 6,
				house_space: 100,
				has_yard: false,
				main_pet_food: 'homemade',
				pet_expenses: 40.5,
				motivation: 'Love for animals',
				favorite_adoption_publications: [],
				photo: {
					_id: '2',
					img_path:
						'https://scontent.fgye1-1.fna.fbcdn.net/v/t1.6435-9/74242360_3195954163812838_4274861617784553472_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFRCjYsTZuQlf2PHyTPJ3HYymegSJbxrSjKZ6BIlvGtKPYIzlm5LEqBr9cR0tDl-FEvtHfkBqZQ6LHCgw-pkTlW&_nc_ohc=dye6H3TWD6QAX-v2xOF&_nc_ht=scontent.fgye1-1.fna&oh=00_AfCF85oDfvg1CEtIJ1We_mJ3gV49fRwyklxfDfl8SouHOA&oe=64D84DE2'
				}
			},
			description: '',
			publication_date: new Date(),
			photo: {
				_id: '',
				img_path: ''
			},
			likes: [],
			comments: [],
			species: ''
		}
	});

	const createPublicationMutation = useMutation({
		mutationFn: (data: ExperiencePublication) =>
			post('/experiences/add', data).then((response) => response.data),
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
