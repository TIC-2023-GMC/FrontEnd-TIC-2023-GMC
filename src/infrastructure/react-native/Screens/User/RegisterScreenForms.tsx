import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, View } from 'react-native';
import { Button, HelperText, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { LoginCredentials, Photo, User, UserRegisterResult, userRegister } from '../../../../domain/models/InterfacesModels';
import { LoginSchema, RegisterSchema } from '../../../../domain/schemas/Schemas';
import { AuthStackParamsList } from '../../../../domain/types/types';
import { styles } from './RegisterScreenForm.styles';
import { RegisterUserUseCase, UploadImageUseCase } from '../../../../application/hooks';
import { container } from 'tsyringe';
import { ScrollView } from 'react-native';
import PhotoSelection from '../../components/PhotoSelection';
import { DatePickerInput } from 'react-native-paper-dates';
const registeruser = container.resolve(RegisterUserUseCase);
const uploadImg = container.resolve(UploadImageUseCase);
export function RegisterScreenForm({
	error,
	setError,
	registerUser
}: {
	error: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
	registerUser: () => void;
}) {
	const [failUpload, setFailUpload] = useState<string>('');
	const theme = useTheme();
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [image, setImage] = useState<string>();
	const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
	const { userRegisterMutation, loading, setLoading } = registeruser.registerUser();
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
			const new_photo: Photo = (await uploadImg.uploadImage(image, setFailUpload)) ?? ({} as Photo);
			data.photo = new_photo;
		}
		const newUser: User = {
			...data,
			num_previous_pets: -1,
			num_current_pets: -1,
			outdoor_hours: -1,
			house_space: -1,
			has_yard: undefined,
			main_pet_food: '',
			pet_expenses: -1,
			motivation: '',
			photo: {img_path: 'nuevafo'}
		};
		console.log(newUser);
		userRegisterMutation.mutate(newUser, {
			onError: () => {
				setError('Error al registrar usuario');
				setLoading(false);
			}
		});
		setLoading(true);
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
					<View style={styles.inputsView}>
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
										onChangeText={onChange}
										value={value}
										mode="outlined"
										label={'Nombre'}
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.email && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										error={!!errors.first_name}
									/>
									{errors.first_name && (
										<HelperText type="error" style={styles.errorText}>
											{errors.first_name?.message}
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
										keyboardType='phone-pad'
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.mobile_phone && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										error={!!errors.mobile_phone}
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
							render={({ field: { onChange, onBlur, value } }) => (
								<>
									<TextInput
										textColor={theme.colors.shadow}
										placeholder="Ingrese su barrio"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										mode="outlined"
										label={'Barrio'}
										style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
										right={
											errors.neighborhood && (
												<TextInput.Icon
													icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
												/>
											)
										}
										error={!!errors.neighborhood}
									/>
									{errors.neighborhood && (
										<HelperText type="error" style={styles.errorText}>
											{errors.neighborhood?.message}
										</HelperText>
									)}
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
										style={{ justifyContent: 'flex-start', alignContent: 'center', height: "5%" }}
									>
										<DatePickerInput
											locale="es"
											label="Fecha de nacimiento:"
											value={value}
											onChange={(d) => onChange(d)}
											inputMode="start"
											mode="outlined"
											//style={{ backgroundColor: 'transparent', color: theme.colors.tertiary }}
											calendarIcon="calendar-range"
											outlineStyle={{ borderColor: 'transparent' }}
											right={
												<IconButton
													icon="pet"
													iconColor={theme.colors.tertiary}
													style={{ alignSelf: 'center', justifyContent: 'space-around', margin: 0, height: 30 }}
												/>
											}
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

						<PhotoSelection image={image} setImage={setImage} />
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
							Ingresar
						</Button>
					</View>
				</View>
			</ScrollView>
		</>
	)
}