import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Image, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { LoginUserUseCase } from '../../../../application/hooks';
import { LoginCredentials } from '../../../../domain/models/InterfacesModels';
import { LoginSchema } from '../../../../domain/schemas/Schemas';
import { AuthStackParamsList } from '../../../../domain/types/types';
import { SnackBarError } from '../../components/SnackBarError';
import { styles } from './LoginScreenForm.styles';
const authUser = container.resolve(LoginUserUseCase);
export function LoginScreenForm({
	error,
	setError,
	loginUser
}: {
	error: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
	loginUser: () => void;
}) {
	const theme = useTheme();
	const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamsList>>();
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
	const { userLoginMutation, loading, setLoading } = authUser.loginUser(loginUser);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});
	useEffect(() => {
		reset();
	}, [reset]);

	const onSubmit: SubmitHandler<LoginCredentials> = (data: LoginCredentials) => {
		userLoginMutation.mutate(data, {
			onError: () => {
				setError('Credenciales incorrectas');
				setLoading(false);
			}
		});
		setLoading(true);
	};

	return (
		<>
			<StatusBar style="dark" />
			<View style={{ ...styles.container, backgroundColor: theme.colors.secondary }}>
				<Image source={require('../../../../assets/logo-removebg.png')} />
				<Text variant="headlineMedium" style={{ ...styles.text, color: theme.colors.primary }}>
					Inicio de Sesión
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
						Ingresar
					</Button>
					<Button
						style={styles.button}
						mode="text"
						compact={true}
						onPress={() => navigation.navigate('Register')}
					>
						Registrarse
					</Button>
				</View>
				<SnackBarError failUpload={error} setFailUpload={setError} reset={reset} />
			</View>
		</>
	);
}
