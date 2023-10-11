import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, ScrollView, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { Avatar, Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { container } from 'tsyringe';
import {
	GetParishUseCase,
	RegisterUserUseCase,
	UploadImageUseCase
} from '../../../../application/hooks';
import { Photo, User } from '../../../../domain/models/InterfacesModels';
import { RegisterSchema } from '../../../../domain/schemas/Schemas';
import { AuthStackParamsList } from '../../../../domain/types/types';
import PhotoSelection from '../../components/PhotoSelection';
import { SnackBarError } from '../../components/SnackBarError';
import { styles } from './RegisterScreenForm.styles';
const registeruser = container.resolve(RegisterUserUseCase);
const uploadImg = container.resolve(UploadImageUseCase);
const parish = container.resolve(GetParishUseCase);
export function RegisterScreenForm({
	error,
	setError,
	loginUser
}: {
	error: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
	loginUser: () => void;
}) {
	const [failUpload, setFailUpload] = useState<string>('');
	const [location, setLocation] = useState<string>('');
	const [openLocation, setOpenLocation] = useState(false);
	const { isLoading, itemsLocation, setItemsLocation } = parish.useQueryParish();
	const theme = useTheme();
	const [isTextVisible, setIsTextVisible] = useState(false);
	const [image, setImage] = useState<string>();
	const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
	const { userRegisterMutation, loading, setLoading } = registeruser.registerUser(loginUser);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			mobile_phone: '',
			neighborhood: '',
			birth_date: new Date(),
			email: '',
			password: '',
			num_previous_pets: -1,
			num_current_pets: -1,
			outdoor_hours: -1,
			house_space: -1,
			has_yard: undefined,
			main_pet_food: '',
			pet_expenses: -1,
			motivation: '',
			photo: {
				img_path: ''
			}
		}
	});
	useEffect(() => {
		reset();
	}, [reset]);

	const onSubmit: SubmitHandler<User> = async (data) => {
		if (image) {
			setLoading(true);
			const new_photo: Photo = (await uploadImg.uploadImage(image, setFailUpload)) ?? ({} as Photo);
			const newUser: User = {
				...data,
				photo: new_photo,
				num_previous_pets: -1,
				num_current_pets: -1,
				outdoor_hours: -1,
				house_space: -1,
				has_yard: false,
				main_pet_food: '',
				pet_expenses: -1,
				motivation: ''
			};
			userRegisterMutation.mutate(newUser, {
				onError: () => {
					setError('Error al registrar usuario');
					setLoading(false);
				},
				onSuccess: () => {
					navigation.navigate('Login');
				}
			});
		}
	};

	return (
		<>
			<ScrollView>
				<StatusBar style="dark" />
				<View style={{ ...styles.container, backgroundColor: theme.colors.secondary }}>
					<Image source={require('../../../../assets/logo-removebg.png')} />
					<Text variant="headlineMedium" style={{ ...styles.text, color: theme.colors.primary }}>
						Registro de Nuevo Usuario
					</Text>
					<View style={{ ...styles.inputsView }}>
						<PhotoSelection image={image} setImage={setImage} />
						{image === undefined && <HelperText type="error">La foto es requerida</HelperText>}
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su nombre"
										onBlur={onBlur}
										onChangeText={(text) => onChange(text.replace(/\s/g, ''))}
										value={value}
										mode="outlined"
										label={'Nombre'}
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.first_name && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										left={<TextInput.Icon icon="account-edit" />}
										error={!!errors.first_name}
									/>
									{errors.first_name && (
										<HelperText type="error" style={styles.errorText}>
											{errors.first_name.message}
										</HelperText>
									)}
								</>
							)}
							name="first_name"
						/>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su apellido"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										mode="outlined"
										label={'Apellido'}
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.last_name && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										left={<TextInput.Icon icon="account-details" />}
										error={!!errors.last_name}
									/>
									{errors.last_name && (
										<HelperText type="error" style={styles.errorText}>
											{errors.last_name?.message}
										</HelperText>
									)}
								</>
							)}
							name="last_name"
						/>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su número de teléfono"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										mode="outlined"
										label={'Número de teléfono'}
										keyboardType="phone-pad"
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.mobile_phone && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										error={!!errors.mobile_phone}
										left={<TextInput.Icon icon="cellphone" />}
									/>
									{errors.mobile_phone && (
										<HelperText type="error" style={styles.errorText}>
											{errors.mobile_phone?.message}
										</HelperText>
									)}
								</>
							)}
							name="mobile_phone"
						/>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange } }) => (
								<>
									<View style={styles.inputContainer}>
										{isTextVisible && (
											<Text
												style={{
													...styles.label,
													color: theme.colors.tertiary,
													backgroundColor: theme.colors.secondary
												}}
											>
												Domicilio
											</Text>
										)}
										<View style={{ ...styles.viewDropdown }}>
											<Avatar.Icon
												icon={'home-city'}
												size={38}
												color={theme.colors.tertiary}
												style={{ backgroundColor: theme.colors.secondary }}
											/>
											<DropDownPicker
												placeholder="Selecciona el sector de tu residencia"
												open={openLocation}
												value={location}
												items={itemsLocation as ItemType<string>[]}
												setValue={setLocation}
												setOpen={setOpenLocation}
												setItems={setItemsLocation}
												onChangeValue={onChange}
												loading={isLoading}
												disableBorderRadius={true}
												listMode="MODAL"
												modalTitle="Seleccione el sector de su residencia"
												modalAnimationType="slide"
												modalProps={{
													animationType: 'fade'
												}}
												style={styles.inputDropdown}
												textStyle={{
													color: location ? 'black' : openLocation ? 'black' : theme.colors.tertiary
												}}
												modalContentContainerStyle={{
													backgroundColor: theme.colors.secondary
												}}
												onSelectItem={() => {
													setIsTextVisible(true);
												}}
											/>
										</View>
										{errors.neighborhood && (
											<HelperText type="error" style={styles.errorText}>
												{errors.neighborhood.message}
											</HelperText>
										)}
									</View>
								</>
							)}
							name="neighborhood"
						/>
						<Controller
							control={control}
							rules={{
								required: 'La fecha de nacimiento es requerida'
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<View
										style={{
											...styles.input,
											backgroundColor: theme.colors.secondary,
											height: '5%',
											marginBottom: '8%'
										}}
									>
										<DatePickerInput
											locale="es"
											value={value}
											onChange={(d) => onChange(d)}
											onBlur={onBlur}
											inputMode="start"
											mode="outlined"
											style={{ backgroundColor: theme.colors.secondary }}
											left={<TextInput.Icon icon="cake-variant" />}
										/>
									</View>
								</>
							)}
							name="birth_date"
						/>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su correo electrónico"
										autoComplete="email"
										onBlur={onBlur}
										onChangeText={onChange}
										keyboardType="email-address"
										value={value}
										mode="outlined"
										label="Correo electrónico:"
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.email && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										left={<TextInput.Icon icon="email" />}
										error={!!errors.email}
									/>
									{errors.email && (
										<HelperText type="error" style={styles.errorText}>
											{errors.email?.message}
										</HelperText>
									)}
								</>
							)}
							name="email"
						/>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su contraseña"
										autoComplete="new-password"
										onBlur={onBlur}
										onChangeText={onChange}
										secureTextEntry={isPasswordVisible}
										value={value}
										mode="outlined"
										label="Contraseña:"
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.password ? (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											) : (
												<TextInput.Icon
													icon={`${isPasswordVisible ? 'eye-off' : 'eye'}`}
													onPress={() => setIsPasswordVisible(!isPasswordVisible)}
												/>
											)
										}
										left={<TextInput.Icon icon="lock" />}
										error={!!errors.password}
									/>
									{errors.password && (
										<HelperText type="error" style={styles.errorText}>
											{errors.password?.message}
										</HelperText>
									)}
								</>
							)}
							name="password"
						/>
					</View>
					<View style={styles.buttonView}>
						<Button
							style={styles.button}
							mode="elevated"
							buttonColor={theme.colors.primary}
							textColor={theme.colors.secondary}
							onPress={handleSubmit(onSubmit)}
							loading={loading}
						>
							Crear Cuenta
						</Button>
						<Button
							style={styles.button}
							mode="text"
							compact={true}
							onPress={() => navigation.navigate('Login')}
						>
							Iniciar Sesión
						</Button>
					</View>
				</View>
				<SnackBarError setFailUpload={setFailUpload} failUpload={failUpload} reset={reset} />
				<SnackBarError failUpload={error} setFailUpload={setError} reset={reset} />
			</ScrollView>
		</>
	);
}
