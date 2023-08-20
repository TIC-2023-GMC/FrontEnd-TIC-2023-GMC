import React, { useContext } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { styles } from './MyProfileScreen.styles';
import { ActivityIndicator, Button, Card, Divider, List, useTheme } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TabNavigationParamsList } from '../../models/types';
import { UserContext, UserContextParams } from '../../auth/userContext';

export function MyProfileScreen() {
	const theme = useTheme();
	const navigation = useNavigation<NavigationProp<TabNavigationParamsList>>();
	const { user } = useContext<UserContextParams>(UserContext);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{
				alignItems: 'center'
			}}
		>
			{user === undefined ? (
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
								source={{ uri: user.photo.img_path }}
								style={styles.image}
								resizeMode="cover"
							/>

							<View style={styles.userInfo}>
								<Text style={styles.infoText}>
									{user.first_name} {user.last_name}
								</Text>

								<Text>{user.neighborhood}</Text>
								<Text>24 años</Text>
							</View>
						</View>
						<View>
							<View style={styles.emailView}>
								<List.Icon color={theme.colors.tertiary} icon="email-outline" />
								<Text style={styles.emailText}>{user.email}</Text>
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
								{user.mobile_phone}
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
								{user.num_previous_pets < 0 ? '' : user.num_previous_pets}
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Número de mascotas actuales:</Text>
							<Text style={styles.aptitudeText}>
								{user.num_current_pets < 0 ? '' : user.num_current_pets}
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Horas fuera de casa:</Text>
							<Text style={styles.aptitudeText}>
								{user.outdoor_hours < 0 ? '' : user.outdoor_hours}
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Área del domicilio:</Text>
							<Text style={styles.aptitudeText}>
								{user.house_space < 0 ? '' : user.house_space} m2
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Casa con patio:</Text>
							<Text style={styles.aptitudeText}>
								{user.has_yard !== undefined ? (user.has_yard ? 'Si' : 'No') : ''}
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Principal alimentación de mascotas:</Text>
							<Text style={styles.aptitudeText}>{user.main_pet_food}</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Gastos mensuales por mascota:</Text>
							<Text style={styles.aptitudeText}>
								$ {user.pet_expenses < 0 ? '' : user.pet_expenses}
							</Text>
						</View>
						<Divider style={{ backgroundColor: theme.colors.primary }} />
						<View style={styles.aptitudeFieldView}>
							<Text style={styles.aptitudeFieldText}>Motivación por adoptar:</Text>
							<Text style={styles.aptitudeText}>{user.motivation}</Text>
						</View>
					</Card>

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
				</>
			)}
		</ScrollView>
	);
}
