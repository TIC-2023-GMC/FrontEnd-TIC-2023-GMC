import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import { Button, Divider, HelperText, RadioButton, TextInput, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/userContext';
import { UpdateUserUseCase, useParish } from '../../../../application/hooks';
import { User, UserAptitude, UserPersonalData } from '../../../../domain/models/InterfacesModels';
import { UserAptitudeSchema, UserPersonalDataSchema } from '../../../../domain/schemas/Schemas';
import { parseNumber, resetNavigationStack } from '../../../../utils/utils';
import { styles } from './UserPersonalDataScreenForm.styles';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

const updateUser = container.resolve(UpdateUserUseCase);
export function UserPersonalDataScreenForm() {
	const theme = useTheme();
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const [openLocation, setOpenLocation] = useState(false);
	const [location, setLocation] = useState<string>('');

	const { isLoading, itemsLocation, setItemsLocation } = useParish();

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(UserPersonalDataSchema),
		defaultValues: {
			first_name: user.first_name,
			last_name: user.last_name,
			mobile_phone: user.mobile_phone,
			neighborhood: user.neighborhood,
			email: user.email,
			password: user.password,
			photo: user.photo
		}
	});
	const resetForm = () => {
		resetNavigationStack(navigation, 'Perfil');
		reset();
	};

	const { updateUserMutation, loading, setLoading } = updateUser.useMutationUser(resetForm);

	const onSubmit: SubmitHandler<UserPersonalData> = async (data) => {
		setLoading(true);
		const updatedUser: User = {
			...user,
			...data
		};
		setUser(updatedUser);
		updateUserMutation.mutate(updatedUser);
	};

	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					resetNavigationStack(navigation, 'Perfil');
					return true;
				}
				return false;
			};
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);
			return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		}, [])
	);

	return (
		<ScrollView style={{ marginBottom: tabBarHeight }}>
			<Text style={styles.instructionText}>
				Por favor, complete los siguientes campos para guardar la información de su perfil
			</Text>
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
							label="Nombre:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.first_name}
							right={
								errors.first_name && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
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
							label="Apellido:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.last_name}
							right={
								errors.last_name && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
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
							placeholder="Ingrese su número celular"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							//value={value < 0 ? '' : value?.toString()}
							value={value}
							label="Número de celular"
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
						{errors.neighborhood && (
							<HelperText type="error">{errors.neighborhood.message}</HelperText>
						)}
					</>
				)}
				name="neighborhood"
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
							placeholder="Ingrese su correo eletrónico"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Correo electrónico:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.email}
							right={
								errors.email && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
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
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Contraseña:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.password}
							right={
								errors.password && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
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
			<Divider bold />

			<View style={styles.buttonView}>
				<Button
					style={styles.button}
					mode="elevated"
					buttonColor={theme.colors.tertiary}
					textColor={theme.colors.secondary}
					onPress={() => {
						reset();
						resetNavigationStack(navigation, 'Perfil');
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
					Guardar
				</Button>
			</View>
		</ScrollView>
	);
}
