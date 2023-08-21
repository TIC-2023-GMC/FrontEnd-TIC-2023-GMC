import React, { useCallback, useContext, useEffect } from 'react';
import { Text, View, Image, ScrollView, BackHandler } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { ActivityIndicator, Button, Card, Divider, List, useTheme } from 'react-native-paper';
import {
	CommonActions,
	NavigationProp,
	useFocusEffect,
	useNavigation
} from '@react-navigation/native';
import { TabNavigationParamsList } from '../../models/types';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdEndpoint } from '../../services/endpoints';
import { User } from '../../models/InterfacesModels';
import { get } from '../../services/api';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { UserContext, UserContextParams } from '../../auth/userContext';

export function ProfileScreen({ route }: any) {
	const theme = useTheme();
	const tabBarHeight = useBottomTabBarHeight();
	const userId = route.params?.userId;
	const navigation = useNavigation<NavigationProp<TabNavigationParamsList>>();
	const { user } = useContext<UserContextParams>(UserContext);
	const [profileUser, setProfileUser] = React.useState<User>(user);

	const { isLoading, refetch, isRefetching, isSuccess, data } = useQuery({
		queryKey: ['userProfileData'],
		queryFn: async () => {
			const response = await get<User>(getUserByIdEndpoint(userId || ''));
			return response.data;
		},
		enabled: !!userId
	});

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
			userId && refetch();
			setProfileUser(user);
		}, [])
	);

	return (
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
									buttonColor={theme.colors.tertiary}
									textColor={theme.colors.secondary}
									icon="phone"
									onPress={() => {
										console.log('phone pressed');
									}}
								>
									{profileUser.mobile_phone}
								</Button>
							</View>
						</Card>
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
									{profileUser.num_previous_pets < 0 ? '' : profileUser.num_previous_pets}
								</Text>
							</View>
							<Divider style={{ backgroundColor: theme.colors.primary }} />
							<View style={styles.aptitudeFieldView}>
								<Text style={styles.aptitudeFieldText}>Número de mascotas actuales:</Text>
								<Text style={styles.aptitudeText}>
									{profileUser.num_current_pets < 0 ? '' : profileUser.num_current_pets}
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
									{profileUser.has_yard !== undefined ? (profileUser.has_yard ? 'Si' : 'No') : ''}
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
									icon={'square-edit-outline'}
									onPress={() => {
										navigation.navigate('Perfil', { screen: 'Editar Perfil' });
									}}
								>
									Editar Perfil
								</Button>
							</View>
						)}
					</>
				)
			)}
		</ScrollView>
	);
}
