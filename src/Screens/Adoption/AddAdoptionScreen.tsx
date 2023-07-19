import { Controller, useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Text, View, Alert, ScrollView } from 'react-native';
import { TextInput, Checkbox, Divider, RadioButton, useTheme, Button } from 'react-native-paper';
import * as z from 'zod';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './AddAdoptionScreen.styles';
import PhotoSelection from '../../components/PhotoSelection';
import { ImagePickerResult } from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
	species: z.string(),
	sex: z.string(),
	breed: z.string(),
	age: z.number()
});

export function AddAdoptionScreen() {
	const {
		control,
		formState: { errors },
		handleSubmit
	} = useForm({
		defaultValues: {
			species: '',
			sex: '',
			breed: '',
			size: '',
			age: '',
			location: '',
			vaccination: '',
			sterilization: '',
			extra: ''
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
	const [image, setImage] = useState<ImagePickerResult>();
	return (
		<ScrollView style={{ marginBottom: tabBarHeight }}>
			{/* Foto */}
			<PhotoSelection image={image} setImage={setImage} />
			{/* Especie */}
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<RadioButton.Group onValueChange={onChange} value={value}>
						<RadioButton.Item value="dog" label="Perro" />
						<RadioButton.Item value="cat" label="Gato" />
					</RadioButton.Group>
				)}
				name="species"
			/>
			<Divider />
			{/* Sexo */}
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<RadioButton.Group onValueChange={onChange} value={value}>
						<RadioButton.Item value="male" label="Macho" />
						<RadioButton.Item value="female" label="Hembra" />
					</RadioButton.Group>
				)}
				name="sex"
			/>
			<Divider />
			{/* Raza */}
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
				name="breed"
			/>
			{errors.breed && <Text>Este campo es obligatorio</Text>}
			<Divider />
			{/* Tamaño*/}
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<DropDownPicker
						placeholder="Selecciona una opción"
						open={openSize}
						value={value as ValueType}
						items={itemsSize}
						setOpen={setOpenSize}
						setValue={onChange}
						setItems={setItemsSize}
						style={{
							backgroundColor: 'transparent',
							borderColor: 'transparent',
							width: '100%',
							height: 60
						}}
						dropDownContainerStyle={{
							width: '100%',
							backgroundColor: theme.colors.secondary,
							borderColor: theme.colors.primary,
							borderWidth: 0.5
						}}
						listMode="SCROLLVIEW"
					/>
				)}
				name="size"
			/>
			<Divider />
			{/* Ubicación */}
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<DropDownPicker
						placeholder="Selecciona una opción"
						open={openLocation}
						value={value as ValueType}
						items={itemsLocation}
						setOpen={setOpenLocation}
						setValue={onChange}
						setItems={setItemsLocation}
						style={{
							backgroundColor: 'transparent',
							borderColor: 'transparent',
							width: '100%',
							height: 60
						}}
						dropDownContainerStyle={{
							width: '100%',
							backgroundColor: theme.colors.secondary,
							borderColor: theme.colors.primary,
							borderWidth: 0.5
						}}
						listMode="SCROLLVIEW"
					/>
				)}
				name="location"
			/>
			<Divider />
			{/* Vacunas */}
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, value } }) => (
					<View style={styles.viewList}>
						<Checkbox
							status={value ? 'checked' : 'unchecked'}
							onPress={() => {
								onChange(!value);
							}}
						/>
						<Text>¿Posee carnet de vacunación?</Text>
					</View>
				)}
				name="vaccination"
			/>
			<Divider />
			{/* Esterilización*/}
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, value } }) => (
					<View style={styles.viewList}>
						<Checkbox
							status={value ? 'checked' : 'unchecked'}
							onPress={() => {
								onChange(!value);
							}}
						/>
						<Text>¿Se Encuentra Esterilizado?</Text>
					</View>
				)}
				name="sterilization"
			/>
			<Divider />
			{/* Extra */}
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						placeholder="Ingrese alguna información addcional del animal"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						label="Descripción:"
						style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
					/>
				)}
				name="extra"
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
					onPress={() => {
						console.log('Enviado');
					}}
				>
					Publicar
				</Button>
			</View>
		</ScrollView>
	);
}
