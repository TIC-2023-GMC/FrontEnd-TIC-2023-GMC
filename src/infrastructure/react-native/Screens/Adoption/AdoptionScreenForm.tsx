import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import {
	Button,
	Checkbox,
	Divider,
	HelperText,
	RadioButton,
	TextInput,
	useTheme
} from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/user.auth';
import {
	CreateAdoptionUseCase,
	GetParishUseCase,
	UploadImageUseCase
} from '../../../../application/hooks';
import { AdoptionPublication, Photo } from '../../../../domain/models/InterfacesModels';
import { AdoptionPublicationSchema } from '../../../../domain/schemas/Schemas';
import { parseNumber, resetNavigationStack } from '../../../../utils/utils';
import PhotoSelection from '../../components/PhotoSelection';
import { SnackBarError } from '../../components/SnackBarError';
import { styles } from './AdoptionScreenForm.styles';

const createAdoption = container.resolve(CreateAdoptionUseCase);
const uploadImg = container.resolve(UploadImageUseCase);
const parish = container.resolve(GetParishUseCase);

export function AdoptionScreenForm() {
	const theme = useTheme();
	const { user } = useContext<UserContextParams>(UserContext);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const [image, setImage] = useState<string>();
	const [failUpload, setFailUpload] = useState<string>('');

	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					resetNavigationStack(navigation, 'Adopciones');
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
		resolver: zodResolver(AdoptionPublicationSchema),
		defaultValues: {
			_id: '',
			user: user,
			description: '',
			publication_date: new Date(),
			photo: {
				img_path: ''
			},
			likes: [],
			is_favorite: false,
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
		{ label: 'Pequeño', value: 'Pequeño' },
		{ label: 'Mediano', value: 'Mediano' },
		{ label: 'Grande', value: 'Grande' }
	]);
	const [openLocation, setOpenLocation] = useState(false);

	const { isLoading, itemsLocation, setItemsLocation } = parish.useQueryParish();
	const [size, setSize] = useState<string>('');
	const [location, setLocation] = useState<string>('');

	const resetForm = () => {
		reset();
		resetNavigationStack(navigation, 'Adopciones');
		setSize('');
		setLocation('');
		setImage(undefined);
	};
	const { createPublicationMutation, loading, setLoading } =
		createAdoption.useMutationAdoptionPublication(resetForm);

	const onSubmit: SubmitHandler<AdoptionPublication> = async (data) => {
		if (image) {
			setLoading(true);
			const new_photo: Photo = (await uploadImg.uploadImage(image, setFailUpload)) ?? ({} as Photo);
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
							textColor={theme.colors.shadow}
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
							textColor={theme.colors.shadow}
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
							dropDownDirection="TOP"
							listMode="SCROLLVIEW"
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
							items={itemsLocation as ItemType<string>[]}
							setValue={setLocation}
							setOpen={setOpenLocation}
							setItems={setItemsLocation}
							onChangeValue={onChange}
							loading={isLoading}
							listMode="MODAL"
							modalTitle="Seleccione el sector"
							modalAnimationType="slide"
							modalContentContainerStyle={{ backgroundColor: theme.colors.secondary }}
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
							textColor={theme.colors.shadow}
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
						resetNavigationStack(navigation, 'Adopciones');
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
					disabled={loading}
				>
					Publicar
				</Button>
			</View>
			<SnackBarError setFailUpload={setFailUpload} failUpload={failUpload} reset={reset} />
		</ScrollView>
	);
}
