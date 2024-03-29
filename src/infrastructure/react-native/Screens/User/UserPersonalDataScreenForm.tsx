import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import { Button, HelperText, Snackbar, TextInput, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/user.auth';
import {
	UpdateUserUseCase,
	UploadImageUseCase,
	GetParishUseCase
} from '../../../../application/hooks';
import { Photo, User, UserPersonalData } from '../../../../domain/models/InterfacesModels';
import { UserPersonalDataSchema } from '../../../../domain/schemas/Schemas';
import { resetNavigationStack } from '../../../../utils/utils';
import { styles } from './UserPersonalDataScreenForm.styles';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import PhotoSelection from '../../components/PhotoSelection';
import { SnackBarError } from '../../components/SnackBarError';

const updateUser = container.resolve(UpdateUserUseCase);
const uploadImg = container.resolve(UploadImageUseCase);
const parish = container.resolve(GetParishUseCase);

export function UserPersonalDataScreenForm() {
	const theme = useTheme();
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const [openLocation, setOpenLocation] = useState(false);
	const [location, setLocation] = useState<string>(user.neighborhood);
	const [image, setImage] = useState<string | undefined>(user.photo.img_path);
	const [failUpload, setFailUpload] = useState<string>('');

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

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
		watch
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

	const { isLoading, itemsLocation, setItemsLocation } = parish.useQueryParish();

	const { updateUserMutation, loading, setLoading, error, resetError } =
		updateUser.useMutationUser(resetForm);

	const onSubmit: SubmitHandler<UserPersonalData> = async (data) => {
		if (image) {
			setLoading(true);
			const userBefore = { ...user };
			if (image !== user.photo.img_path) {
				const new_photo: Photo =
					(await uploadImg.uploadImage(image, setFailUpload)) ?? ({} as Photo);
				const updatedUser: User = {
					...user,
					...data,
					photo: new_photo
				};
				setUser(updatedUser);
				updateUserMutation.mutate(updatedUser, { onError: () => setUser(userBefore) });
			} else {
				const updatedUser: User = {
					...user,
					...data
				};
				setUser(updatedUser);
				updateUserMutation.mutate(updatedUser, { onError: () => setUser(userBefore) });
			}
		}
	};

	const formUser = watch();

	return (
		<ScrollView style={{ marginBottom: tabBarHeight }}>
			<PhotoSelection image={image} setImage={setImage} aspect={[1, 1]} />
			{image === undefined && <HelperText type="error">La foto es requerida</HelperText>}
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
							onChangeText={onChange}
							keyboardType="numeric"
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
							placeholder="Seleccione el sector"
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
					disabled={
						formUser.first_name === user.first_name &&
						formUser.last_name === user.last_name &&
						formUser.mobile_phone === user.mobile_phone &&
						formUser.neighborhood === user.neighborhood &&
						formUser.email === user.email &&
						image === user.photo.img_path &&
						!loading
					}
				>
					Guardar
				</Button>
			</View>
			<Snackbar
				onIconPress={resetError}
				icon="close"
				visible={error}
				onDismiss={resetError}
				duration={5000}
			>
				¡Ya existe un usuario con ese email o celular!
			</Snackbar>
			<SnackBarError setFailUpload={setFailUpload} failUpload={failUpload} reset={reset} />
		</ScrollView>
	);
}
