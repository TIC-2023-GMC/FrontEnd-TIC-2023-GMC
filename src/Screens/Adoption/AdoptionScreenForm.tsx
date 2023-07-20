import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { TextInput, Checkbox, Divider, RadioButton, useTheme, Button } from 'react-native-paper';
import * as z from 'zod';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './AdoptionScreenForm.styles';
import PhotoSelection from '../../components/PhotoSelection';
import { baseUrl, post } from '../../services/api';
import * as FileSystem from 'expo-file-system';
import { AdoptionPublication, Photo } from '../../models/InterfacesModels';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

const PhotoSchema = z.object({
	_id: z.string(),
	img_path: z.string()
});

const UserSchema = z.object({
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
	description: z.string(),
	publication_date: z.string(),
	photo: PhotoSchema,
	likes: z.optional(z.array(Like)),
	comments: z.optional(z.array(Comment)),
	species: z.string(),
	pet_size: z.string(),
	pet_breed: z.string(),
	pet_age: z.number(),
	pet_sex: z.boolean(),
	pet_location: z.string(),
	sterilized: z.boolean(),
	vaccination_card: z.boolean()
});

function formatDate(date: Date): string {
	if (!date) {
		return '';
	} else {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date?.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
}

export function AdoptionScreenForm() {
	const {
		control,
		formState: { errors },
		handleSubmit
	} = useForm({
		resolver: zodResolver(AdoptionPublicationSchema),
		defaultValues: {
			_id: '1',
			user: {
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
			publication_date: formatDate(new Date()),
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
			pet_sex: false,
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
		{ label: 'Pequeño', value: 'Pequeño' }, //valores que van a tener los va
		{ label: 'Mediano', value: 'Mediano' },
		{ label: 'Grande', value: 'Grande' }
	]);

	const theme = useTheme();
	const tabBarHeight = useBottomTabBarHeight();
	const [image, setImage] = useState<string>();

	const createPublicationMutation = useMutation({
		mutationFn: (data: AdoptionPublication) =>
			post('/adoptions/adoption', data).then((response) => response.data),
		onSuccess: () => {
			console.log('Publicación creada');
		}
	});

	const uploadImg = async (uri: string) => {
		try {
			const response = await FileSystem.uploadAsync(`${baseUrl}/photo/upload_photo`, uri, {
				fieldName: 'photo',
				httpMethod: 'POST',
				uploadType: FileSystem.FileSystemUploadType.MULTIPART,
				headers: {
					'Content-Type': 'multipart'
				}
			});
			//console.log(response.body);

			return response.body;
		} catch (error) {
			console.log('ERROR', error);
		}
	};

	const onSubmit: SubmitHandler<AdoptionPublication> = async (data) => {
		const response_body = await uploadImg(image!);

		const response = JSON.parse(response_body!);

		const new_photo: Photo = {
			...response
		};

		console.log(new_photo);

		const new_publication: AdoptionPublication = {
			...data,
			photo: new_photo
		};

		createPublicationMutation.mutate(new_publication);
	};

	return (
		<ScrollView style={{ marginBottom: tabBarHeight }}>
			<PhotoSelection image={image} setImage={setImage} />
			<Text style={styles.text}>Especie:</Text>
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<RadioButton.Group onValueChange={onChange} value={value}>
						<View style={styles.viewList}>
							<RadioButton.Item
								position="leading"
								value="dog"
								label="Perro"
								style={styles.radioButton}
								labelStyle={styles.labelRadioButton}
							/>
							<RadioButton.Item
								position="leading"
								value="cat"
								label="Gato"
								style={styles.radioButton}
								labelStyle={styles.labelRadioButton}
							/>
						</View>
					</RadioButton.Group>
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
					<RadioButton.Group onValueChange={onChange} value={value ? 'male' : 'female'}>
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
					<TextInput
						placeholder="Ingrese la raza del animal"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Raza:"
						style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
					/>
				)}
				name="pet_breed"
			/>
			{errors.pet_breed && <Text>Este campo es obligatorio</Text>}
			<Divider />
			{/* Tamaño*/}
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<DropDownPicker
						placeholder="Selecciona el sector"
						open={openSize}
						value={value as ValueType}
						items={itemsSize}
						setOpen={setOpenSize}
						setValue={onChange}
						setItems={setItemsSize}
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
				)}
				name="pet_size"
			/>
			<Divider />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<DropDownPicker
						placeholder="Selecciona el tamaño"
						open={openLocation}
						value={value as ValueType}
						items={itemsLocation}
						setOpen={setOpenLocation}
						setValue={onChange}
						setItems={setItemsLocation}
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
				)}
				name="pet_location"
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
					<TextInput
						placeholder="Ingrese alguna información adicional del animal"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Descripción:"
						style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
					/>
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
						console.log('Cancelado');
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
					/* onPress={() => {
						//uploadImg(image!);
						onSubmit({});
					}} */
				>
					Publicar
				</Button>
			</View>
		</ScrollView>
	);
}
