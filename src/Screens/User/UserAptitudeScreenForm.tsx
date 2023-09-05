import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useContext, useState } from 'react';
import { Text, View, ScrollView, BackHandler } from 'react-native';
import { TextInput, Divider, RadioButton, useTheme, Button, HelperText } from 'react-native-paper';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { styles } from './UserAptitudeScreenForm.styles';
import { put } from '../../services/api';
import { User, UserAptitude } from '../../models/InterfacesModels';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { parseNumber, resetNavigationStack } from '../../utils/utils';
import { UserAptitudeSchema } from '../../models/Schemas';
import { UserContext, UserContextParams } from '../../auth/userContext';
import { getUpdateUserEndpoint } from '../../services/endpoints';

export function UserAptitudeScreenForm() {
	const theme = useTheme();
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const navigation = useNavigation();
	const tabBarHeight = useBottomTabBarHeight();
	const [loading, setLoading] = useState<boolean>(false);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(UserAptitudeSchema),
		defaultValues: {
			num_previous_pets: user.num_previous_pets,
			num_current_pets: user.num_current_pets,
			outdoor_hours: user.outdoor_hours,
			house_space: user.house_space,
			has_yard: user.has_yard,
			main_pet_food: user.main_pet_food,
			pet_expenses: user.pet_expenses,
			motivation: user.motivation
		}
	});

	const updateUserMutation = useMutation({
		mutationFn: (data: User) =>
			put(getUpdateUserEndpoint(), data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			resetNavigationStack(navigation, 'Perfil');
			reset();
		}
	});

	const onSubmit: SubmitHandler<UserAptitude> = async (data) => {
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
				Por favor, complete los siguientes campos para guardar información sobre su experiencia en
				el cuidado de animales
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
							placeholder="Ingrese el número de mascotas que ha tenido"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value < 0 ? '' : value.toString()}
							label="Número de mascotas previas:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.num_previous_pets && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.num_previous_pets}
						/>
						{errors.num_previous_pets && (
							<HelperText type="error" style={styles.errorText}>
								{errors.num_previous_pets?.message}
							</HelperText>
						)}
					</>
				)}
				name="num_previous_pets"
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
							placeholder="Ingrese el número de mascotas que tiene"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value < 0 ? '' : value?.toString()}
							label="Número de mascotas actuales:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.num_current_pets && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.num_current_pets}
						/>
						{errors.num_current_pets && (
							<HelperText type="error" style={styles.errorText}>
								{errors.num_current_pets?.message}
							</HelperText>
						)}
					</>
				)}
				name="num_current_pets"
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
							placeholder="Indique el tiempo que pasa fuera de su hogar"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value < 0 ? '' : value?.toString()}
							label="Horas fuera del hogar al día (promedio):"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.outdoor_hours && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.outdoor_hours}
						/>
						{errors.outdoor_hours && (
							<HelperText type="error" style={styles.errorText}>
								{errors.outdoor_hours?.message}
							</HelperText>
						)}
					</>
				)}
				name="outdoor_hours"
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
							placeholder="Indique el área de su domicilio (m2)"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value < 0 ? '' : value?.toString()}
							label="Área de su domicilio:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.house_space && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.house_space}
						/>
						{errors.house_space && (
							<HelperText type="error" style={styles.errorText}>
								{errors.house_space?.message}
							</HelperText>
						)}
					</>
				)}
				name="house_space"
			/>
			<Text style={styles.text}>¿Su domicilio tiene patio?:</Text>
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, value } }) => (
					<>
						<RadioButton.Group
							onValueChange={(newValue) => onChange(newValue === 'si')}
							value={value === undefined ? '' : value ? 'si' : 'no'}
						>
							<View style={styles.radioGroupView}>
								<RadioButton.Item
									position="leading"
									value="si"
									label="SI"
									style={styles.radioButton}
									labelStyle={styles.radioButtonLabel}
								/>
								<RadioButton.Item
									position="leading"
									value="no"
									label="NO"
									style={styles.radioButton}
									labelStyle={styles.radioButtonLabel}
								/>
							</View>
						</RadioButton.Group>
						{errors.has_yard && (
							<HelperText type="error" style={styles.errorText}>
								{errors.has_yard.message}
							</HelperText>
						)}
					</>
				)}
				name="has_yard"
			/>
			<Divider bold />
			<Controller
				control={control}
				rules={{
					required: true
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							textColor={theme.colors.shadow}
							placeholder='Ej: "Comida casera", "Croquetas"'
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Principal tipo de alimento de sus mascotas:"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							error={!!errors.main_pet_food}
							right={
								errors.main_pet_food && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
						/>
						{errors.main_pet_food && (
							<HelperText type="error" style={styles.errorText}>
								{errors.main_pet_food.message}
							</HelperText>
						)}
					</>
				)}
				name="main_pet_food"
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
							placeholder="Indique sus gastos mensuales por mascota"
							onBlur={onBlur}
							onChangeText={(newValue) => onChange(parseNumber(newValue))}
							keyboardType="numeric"
							value={value < 0 ? '' : value?.toString()}
							label="Gastos mensuales por mascota (promedio $):"
							style={{ ...styles.input, backgroundColor: theme.colors.secondary }}
							right={
								errors.pet_expenses && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.pet_expenses}
						/>
						{errors.pet_expenses && (
							<HelperText type="error" style={styles.errorText}>
								{errors.pet_expenses?.message}
							</HelperText>
						)}
					</>
				)}
				name="pet_expenses"
			/>
			<Controller
				control={control}
				rules={{
					required: false
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<TextInput
							numberOfLines={2}
							multiline={true}
							textColor={theme.colors.shadow}
							placeholder="Ingrese su principal motivación por adoptar"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							label="Motivación por adoptar:"
							style={[
								styles.input,
								styles.motivationInput,
								{ backgroundColor: theme.colors.secondary }
							]}
							right={
								errors.motivation && (
									<TextInput.Icon
										icon={() => <Ionicons name="alert-circle" size={24} color="red" />}
									/>
								)
							}
							error={!!errors.motivation}
						/>
						{errors.motivation && (
							<HelperText type="error" style={styles.errorText}>
								{errors.motivation.message}
							</HelperText>
						)}
					</>
				)}
				name="motivation"
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
				>
					Guardar
				</Button>
			</View>
		</ScrollView>
	);
}
