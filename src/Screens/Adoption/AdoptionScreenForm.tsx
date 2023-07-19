import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { TextInput, Checkbox, Divider, RadioButton, useTheme, Button } from 'react-native-paper';
import * as z from 'zod';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './AdoptionScreenForm.styles';
import PhotoSelection from '../../components/PhotoSelection';
import { ImagePickerResult } from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
	species: z.string(),
	sex: z.string(),
	breed: z.string(),
	age: z.number()
});

export function AdoptionScreenForm() {
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
					<RadioButton.Group onValueChange={onChange} value={value}>
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
				name="sex"
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
				name="breed"
			/>
			{errors.breed && <Text>Este campo es obligatorio</Text>}
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
				name="size"
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
				name="location"
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
				name="vaccination"
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
				name="sterilization"
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
