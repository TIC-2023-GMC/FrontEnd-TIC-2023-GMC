import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import {
	TextInput,
	Checkbox,
	Divider,
	RadioButton,
	useTheme,
	Button,
	HelperText
} from 'react-native-paper';
import * as z from 'zod';
import DropDownPicker from 'react-native-dropdown-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './AdoptionScreenForm.styles';
import PhotoSelection from '../../components/PhotoSelection';
import { baseUrl, post } from '../../services/api';
import * as FileSystem from 'expo-file-system';
import { AdoptionPublication, Photo } from '../../models/InterfacesModels';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { parseNumber } from '../../utils/utils';

const PhotoSchema = z.object({
	_id: z.string(),
	img_path: z.string()
});

const UserSchema = z.object({
	_id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	mobile_phone: z.string(),
	neighborhood: z.string(),
	email: z.string().email(),
	password: z.string(),
	num_previous_pets: z.number(),
	num_current_pets: z.number(),
	outdoor_hours: z.number(),
	house_space: z.number(),
	has_yard: z.boolean(),
	main_pet_food: z.string(),
	pet_expenses: z.number(),
	motivation: z.string(),
	favorite_adoption_publications: z.array(z.string()),
	photo: PhotoSchema
});

const Like = z.object({
	_id: z.string()
});

const Comment = z.object({
	_id: z.string(),
	comment_text: z.string(),
	comment_date: z.string()
});

const AdoptionPublicationSchema = z.object({
	_id: z.string(),
	user: UserSchema,
	description: z.string().nonempty('La descripción es requerida'),
	publication_date: z.date(),
	photo: PhotoSchema,
	likes: z.optional(z.array(Like)),
	comments: z.optional(z.array(Comment)),
	species: z.string().nonempty('La especie del animal es requerida'),
	pet_size: z.string().nonempty('El tamaño del animal es requerido'),
	pet_breed: z.string().nonempty('La raza del animal es requerida'),
	pet_age: z.number().positive('La edad del animal debe ser un número positivo'),
	pet_sex: z.boolean({
		required_error: 'El sexo del animal es requerido'
	}),
	pet_location: z.string().nonempty('La ubicación del animal es requerida'),
	sterilized: z.boolean({ required_error: 'Selecciona si se encuentra esterilizado' }),
	vaccination_card: z.boolean({ required_error: 'Selecciona si posee carnet de vacunación' })
});

export function AdoptionScreenForm() {
	const theme = useTheme();
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const [image, setImage] = useState<string>();
	const [loading, setLoading] = useState<boolean>(false);
	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(AdoptionPublicationSchema),
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
			species: '',
			pet_size: '',
			pet_breed: '',
			pet_age: 0,
			pet_sex: undefined,
			pet_location: '',
			sterilized: false,
			vaccination_card: false
		}
	});
	const [openSize, setOpenSize] = useState(false);
	const [itemsSize, setItemsSize] = useState([
		{ label: 'Pequeño', value: 'Pequeño' }, //valores que van a tener los va
		{ label: 'Mediano', value: 'Mediano' },
		{ label: 'Grande', value: 'Grande' }
	]);
	const [openLocation, setOpenLocation] = useState(false);
	const [itemsLocation, setItemsLocation] = useState([
		{ label: 'Carapungo', value: 'Carapungo' }, //valores que van a tener los va
		{ label: 'Cumbayork', value: 'Cumbayork' },
		{ label: 'Chillogallo', value: 'Chillogallo' }
	]);

	const [size, setSize] = useState<string>('');
	const [location, setLocation] = useState<string>('');

	const createPublicationMutation = useMutation({
		mutationFn: (data: AdoptionPublication) =>
			post('/adoptions/add', data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			navigation.goBack();
			reset();
			setSize('');
			setLocation('');
			setImage(undefined);
		}
	});

	const uploadImg = async (uri: string) => {
		try {
			const response = await FileSystem.uploadAsync(`${baseUrl}/photo/upload`, uri, {
				fieldName: 'photo',
				httpMethod: 'POST',
				uploadType: FileSystem.FileSystemUploadType.MULTIPART,
				headers: {
					'Content-Type': 'multipart'
				}
			});
			return response.body;
		} catch (error) {
			console.log('ERROR', error);
		}
	};

	const onSubmit: SubmitHandler<AdoptionPublication> = async (data) => {
		if (image) {
			setLoading(true);

			const response_body = await uploadImg(image);
			const response = JSON.parse(response_body ? response_body : '{}');
			const new_photo: Photo = {
				...response
			};

			const currentDateUTC = new Date();
			const timezoneOffset = currentDateUTC.getTimezoneOffset() * 60000;
			const currentDateLocal = new Date(currentDateUTC.getTime() - timezoneOffset);
			const new_publication: AdoptionPublication = {
				...data,
				publication_date: currentDateLocal,
				photo: new_photo
			};
			createPublicationMutation.mutate(new_publication);
		}
	};

	return (
		<ScrollView style={{ marginBottom: tabBarHeight }}>
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
			<Text style={styles.text}>Sexo:</Text>
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<>
						<RadioButton.Group
							onValueChange={(newValue) => onChange(newValue === 'male')}
							value={value === undefined ? '' : value ? 'male' : 'female'}
						>
							<View style={styles.viewList}>
								<RadioButton.Item
									position="leading"
									value="male"
									label="Macho"
									style={styles.radioButton}
									labelStyle={styles.labelRadioButton}
								/>
								<RadioButton.Item
									position="leading"
									value="female"
									label="Hembra"
									style={styles.radioButton}
									labelStyle={styles.labelRadioButton}
								/>
							</View>
						</RadioButton.Group>
						{errors.pet_sex && <HelperText type="error">{errors.pet_sex.message}</HelperText>}
					</>
				)}
				name="pet_sex"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							placeholder="Ingrese la raza del animal"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Raza:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.pet_breed}
							right={
								errors.pet_breed && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
						/>
						{errors.pet_breed && <HelperText type="error">{errors.pet_breed.message}</HelperText>}
					</>
				)}
				name="pet_breed"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							placeholder="Ingrese la edad en meses del animal"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value === 0 ? '' : value.toString()}
							label="Edad:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.pet_age && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.pet_age}
						/>
						{errors.pet_age && <HelperText type="error">{errors.pet_age?.message}</HelperText>}
					</>
				)}
				name="pet_age"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange } }) => (
					<>
						<DropDownPicker
							placeholder="Selecciona el tamaño del animal"
							open={openSize}
							value={size}
							items={itemsSize}
							setOpen={setOpenSize}
							setValue={setSize}
							setItems={setItemsSize}
							onChangeValue={onChange}
							style={{
								...styles.comboItem,
								borderColor: theme.colors.tertiary,
								height: 50
							}}
							dropDownContainerStyle={{
								width: '100%',
								backgroundColor: 'white',
								borderColor: theme.colors.primary,
								borderWidth: 0.5
							}}
							listMode="SCROLLVIEW"
							dropDownDirection="TOP"
						/>
						{errors.pet_size && <HelperText type="error">{errors.pet_size.message}</HelperText>}
					</>
				)}
				name="pet_size"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange } }) => (
					<>
						<DropDownPicker
							placeholder="Selecciona el sector"
							open={openLocation}
							value={location}
							items={itemsLocation}
							setValue={setLocation}
							setOpen={setOpenLocation}
							setItems={setItemsLocation}
							onChangeValue={onChange}
							style={{
								...styles.comboItem,
								borderColor: theme.colors.tertiary,
								height: 50
							}}
							dropDownContainerStyle={{
								width: '100%',
								backgroundColor: 'white',
								borderColor: theme.colors.primary,
								borderWidth: 0.5
							}}
							listMode="SCROLLVIEW"
							dropDownDirection="TOP"
						/>
						{errors.pet_location && (
							<HelperText type="error">{errors.pet_location.message}</HelperText>
						)}
					</>
				)}
				name="pet_location"
			/>
			<Divider />
			<Text style={styles.text}>Seleccione:</Text>
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, value } }) => (
					<Checkbox.Item
						style={styles.viewList}
						status={value ? 'checked' : 'unchecked'}
						onPress={() => {
							onChange(!value);
						}}
						label="¿Posee carnet de vacunación?"
						position="leading"
						labelStyle={{ textAlign: 'center' }}
					/>
				)}
				name="vaccination_card"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, value } }) => (
					<Checkbox.Item
						style={styles.viewList}
						status={value ? 'checked' : 'unchecked'}
						onPress={() => {
							onChange(!value);
						}}
						label="¿Se Encuentra Esterilizado?"
						position="leading"
						labelStyle={{ textAlign: 'center' }}
					/>
				)}
				name="sterilized"
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
							placeholder="Ingrese alguna información adicional del animal"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Descripción:"
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
						reset();
						navigation.goBack();
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
		</ScrollView>
	);
}
