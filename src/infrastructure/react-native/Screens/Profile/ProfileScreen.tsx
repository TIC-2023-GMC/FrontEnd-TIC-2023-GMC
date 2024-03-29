import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
	CommonActions,
	NavigationProp,
	useFocusEffect,
	useNavigation
} from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BackHandler, Image, Linking, ScrollView, Text, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Card,
	Divider,
	List,
	Snackbar,
	useTheme
} from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/user.auth';
import { GetUserUseCase } from '../../../../application/hooks';
import { User } from '../../../../domain/models/InterfacesModels';
import { TabNavigationParamsList } from '../../../../domain/types/types';
import { styles } from './ProfileScreen.styles';

const getUser = container.resolve(GetUserUseCase);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileScreen({ route }: any) {
	const theme = useTheme();
	const tabBarHeight = useBottomTabBarHeight();
	const userId = route.params?.userId;
	const navigation = useNavigation<NavigationProp<TabNavigationParamsList>>();
	const { user, logOut } = useContext<UserContextParams>(UserContext);
	const [profileUser, setProfileUser] = React.useState<User>(user);
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	const { isLoading, isRefetching, isSuccess, data } = getUser.useQueryUser(userId);

	useEffect(() => {
		if (isSuccess) {
			setProfileUser(data);
		}
	}, [isSuccess, data]);

	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [{ name: 'Adopciones' }]
						})
					);
					return true;
				}
				return false;
			};
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);
			return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		}, [])
	);

	useFocusEffect(
		useCallback(() => {
			!userId && setProfileUser(user);
		}, [])
	);

	return (
		<>
			<ScrollView
				style={{ ...styles.container, marginBottom: tabBarHeight }}
				contentContainerStyle={{
					minHeight: '100%',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				{!!userId && (isLoading || isRefetching) ? (
					<ActivityIndicator animating={true} size={100} style={{ flex: 1 }}></ActivityIndicator>
				) : (
					profileUser && (
						<>
							<Card style={styles.profileContainer}>
								<Card.Title
									style={[styles.cardTitles, { backgroundColor: theme.colors.primary }]}
									title="Datos Personales"
									titleStyle={[styles.aptitudeTitleText, { color: theme.colors.secondary }]}
								/>
								<View style={styles.basicInfoContainer}>
									<Image
										source={{ uri: profileUser.photo.img_path }}
										style={styles.image}
										resizeMode="cover"
									/>

									<View style={styles.userInfo}>
										<Text style={styles.infoText}>
											{profileUser.first_name} {profileUser.last_name}
										</Text>

										<Text>{profileUser.neighborhood}</Text>
										<Text>
											{Math.floor(
												(new Date().getTime() - new Date(profileUser.birth_date).getTime()) /
													3.15576e10
											)}{' '}
											años
										</Text>
									</View>
								</View>
								<View>
									<View style={styles.emailView}>
										<List.Icon color={theme.colors.tertiary} icon="email-outline" />
										<Text style={styles.emailText}>{profileUser.email}</Text>
									</View>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.primary}
										textColor={theme.colors.secondary}
										icon="phone"
										onPress={() => {
											Linking.openURL(`tel:+593${profileUser.mobile_phone.slice(1)}`);
										}}
									>
										Llamar a {profileUser.first_name}
									</Button>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.primary}
										textColor={theme.colors.secondary}
										icon="whatsapp"
										onPress={() => {
											Linking.canOpenURL(
												`http://api.whatsapp.com/send?phone=${
													'+593' + profileUser.mobile_phone.slice(1)
												}`
											).then((supported) => {
												if (supported) {
													Linking.openURL(
														`http://api.whatsapp.com/send?phone=${
															'+593' + profileUser.mobile_phone.slice(1)
														}`
													);
												} else {
													setSnackbarVisible(true);
												}
											});
										}}
									>
										Enviar mensaje a {profileUser.first_name}
									</Button>
								</View>
							</Card>
							{!userId && (
								<Button
									style={styles.button}
									mode="elevated"
									buttonColor={theme.colors.tertiary}
									textColor={theme.colors.secondary}
									icon={'square-edit-outline'}
									onPress={() => {
										navigation.navigate('Perfil', { screen: 'Editar Perfil' });
									}}
								>
									Editar Datos Personales
								</Button>
							)}
							<Card
								style={[
									styles.profileContainer,
									styles.aptitudeContainer,
									userId ? { marginBottom: 60 } : {}
								]}
							>
								<Card.Title
									style={[styles.cardTitles, { backgroundColor: theme.colors.primary }]}
									title="Datos de Aptitud"
									titleStyle={[styles.aptitudeTitleText, { color: theme.colors.secondary }]}
								/>
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Número de mascotas previas:</Text>
									<Text style={styles.aptitudeText}>
										{profileUser.num_previous_pets < 0
											? ''
											: profileUser.num_previous_pets > 20
											? 'Más de 20'
											: profileUser.num_previous_pets}
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Número de mascotas actuales:</Text>
									<Text style={styles.aptitudeText}>
										{profileUser.num_current_pets < 0
											? ''
											: profileUser.num_current_pets > 20
											? 'Más de 20'
											: profileUser.num_current_pets}
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Horas fuera de casa:</Text>
									<Text style={styles.aptitudeText}>
										{profileUser.outdoor_hours < 0 ? '' : profileUser.outdoor_hours}
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Área del domicilio:</Text>
									<Text style={styles.aptitudeText}>
										{profileUser.house_space < 0 ? '' : profileUser.house_space} m²
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Casa con patio:</Text>
									<Text style={styles.aptitudeText}>
										{profileUser.has_yard !== undefined && (profileUser.has_yard ? 'Si' : 'No')}
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Principal alimentación de mascotas:</Text>
									<Text style={styles.aptitudeText}>{profileUser.main_pet_food}</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Gastos mensuales por mascota:</Text>
									<Text style={styles.aptitudeText}>
										$ {profileUser.pet_expenses < 0 ? '' : profileUser.pet_expenses}
									</Text>
								</View>
								<Divider style={{ backgroundColor: theme.colors.primary }} />
								<View style={styles.aptitudeFieldView}>
									<Text style={styles.aptitudeFieldText}>Motivación por adoptar:</Text>
									<Text style={styles.aptitudeText}>{profileUser.motivation}</Text>
								</View>
							</Card>

							{!userId && (
								<View style={styles.profileButtonsView}>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.tertiary}
										textColor={theme.colors.secondary}
										icon={'square-edit-outline'}
										onPress={() => {
											navigation.navigate('Perfil', { screen: 'Editar Aptitud' });
										}}
									>
										Editar Datos de Aptitud
									</Button>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.primary}
										textColor={theme.colors.secondary}
										onPress={() => {
											navigation.navigate('Perfil', { screen: 'Mis Publicaciones' });
										}}
									>
										Mis Publicaciones
									</Button>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.primary}
										textColor={theme.colors.secondary}
										onPress={() => {
											navigation.navigate('Perfil', { screen: 'Favoritos' });
										}}
									>
										Mis Favoritos
									</Button>
									<Button
										style={styles.button}
										mode="elevated"
										buttonColor={theme.colors.tertiary}
										textColor={theme.colors.secondary}
										icon={'logout'}
										onPress={() => {
											logOut();
										}}
									>
										Cerrar Sesión
									</Button>
								</View>
							)}
						</>
					)
				)}
			</ScrollView>

			<Snackbar
				onIconPress={() => setSnackbarVisible(false)}
				style={styles.snackbarStyle}
				duration={3000}
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
			>
				Error al abrir Whatsapp...
			</Snackbar>
		</>
	);
}
