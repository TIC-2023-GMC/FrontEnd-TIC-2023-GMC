import React, { useCallback, useContext, useState } from 'react';
import { Text, View, Image, ScrollView, BackHandler } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { ActivityIndicator, Button, Card, Divider, List, useTheme } from 'react-native-paper';
import { CommonActions, RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { ProfileParamsList, TabNavigationParamsList } from '../../models/types';
import { UserContext, UserContextParams } from '../../auth/userContext';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdEndpoint } from '../../services/endpoints';
import { get } from '../../services/api';
import { User } from '../../models/InterfacesModels';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileScreenRouteProp = RouteProp<ProfileParamsList, 'PerfilUsuario'>;
interface propsProfileScreen {
	route: ProfileScreenRouteProp;
}

export function ProfileScreen({ route }: propsProfileScreen) {
	const theme = useTheme();
	const { userId } = route.params;
	const navigation = useNavigation<NativeStackNavigationProp<TabNavigationParamsList>>();
	const profileUserId = userId;

	const { user } = useContext<UserContextParams>(UserContext);
	const [profileUser, setProfileUser] = useState<User | undefined>(undefined);

	const { isLoading, refetch, isRefetching } = useQuery({
		queryKey: ['userProfileData'],
		queryFn: async () => {
			const response = await get<User>(getUserByIdEndpoint(profileUserId));
			return response.data;
		},
		onSuccess: (data) => {
			setProfileUser(data);
		}
	});

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
					setProfileUser(undefined);

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
			refetch();
		}, [])
	);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{
				alignItems: 'center'
			}}
		>
			{isLoading || isRefetching || profileUser === undefined ? (
				<ActivityIndicator animating={true} size="large"></ActivityIndicator>
			) : (
				<>
					<Card style={[styles.profileContainer]}>
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
								<Text>24 años</Text>
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
					<Card style={[styles.profileContainer, styles.aptitudeContainer]}>
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
								{profileUser.house_space < 0 ? '' : profileUser.house_space} m2
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
					{profileUser._id == user._id ? (
						<View style={styles.profileButtonsView}>
							<Button
								style={styles.button}
								mode="elevated"
								buttonColor={theme.colors.primary}
								textColor={theme.colors.secondary}
								onPress={() => {
									navigation.navigate('Mis Publicaciones');
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
									navigation.navigate('Favoritos');
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
									navigation.navigate('Editar Perfil');
								}}
							>
								Editar Perfil
							</Button>
						</View>
					) : (
						<View style={styles.profileButtonsView}></View>
					)}
				</>
			)}
		</ScrollView>
	);
}
