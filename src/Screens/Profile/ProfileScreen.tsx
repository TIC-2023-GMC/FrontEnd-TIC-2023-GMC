import React, { useContext } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { Button, Card, Divider, List, useTheme } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TabNavigation } from '../../models/types';
import { UserContext, UserContextParams } from '../../auth/userContext';

export function ProfileScreen() {
	const theme = useTheme();
	const navigation = useNavigation<NavigationProp<TabNavigation>>();
	const { user } = useContext<UserContextParams>(UserContext);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{
				alignItems: 'center'
			}}
		>
			<Card style={[styles.profileContainer, { backgroundColor: theme.colors.primary }]}>
				<View style={styles.basicInfoContainer}>
					<Image source={{ uri: user.photo.img_path }} style={styles.image} resizeMode="cover" />

					<View style={styles.userInfo}>
						<Text style={styles.infoText}>
							{user.first_name} {user.last_name}
						</Text>

						<Text>{user.neighborhood}</Text>
						<Text>24 años</Text>
					</View>
				</View>
				<View>
					<Text style={styles.contactTitleText}>Contacto:</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center'
						}}
					>
						<List.Icon color={theme.colors.secondary} icon="email-outline" />
						<Text style={styles.emailText}>{user.email}</Text>
					</View>
					<Button
						style={styles.button}
						mode="elevated"
						buttonColor={theme.colors.tertiary}
						textColor={theme.colors.secondary}
						icon="phone"
						onPress={() => {
							navigation.navigate('Mis Publicaciones');
						}}
					>
						{user.mobile_phone}
					</Button>
				</View>
			</Card>
			<Card
				style={[
					styles.profileContainer,
					styles.aptitudeContainer,
					{ backgroundColor: theme.colors.primary }
				]}
			>
				<Card.Title
					title="Datos de Aptitud"
					titleStyle={[styles.aptitudeTitleText, { color: theme.colors.secondary }]}
				/>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Número de mascotas previas:</Text>
					<Text style={styles.aptitudeText}>
						{user.num_previous_pets < 0 ? '' : user.num_previous_pets}
					</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Número de mascotas actuales:</Text>
					<Text style={styles.aptitudeText}>
						{user.num_current_pets < 0 ? '' : user.num_current_pets}
					</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Horas fuera de casa:</Text>
					<Text style={styles.aptitudeText}>
						{user.outdoor_hours < 0 ? '' : user.outdoor_hours}
					</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Área del domicilio:</Text>
					<Text style={styles.aptitudeText}>{user.house_space < 0 ? '' : user.house_space} m2</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Casa con patio:</Text>
					<Text style={styles.aptitudeText}>
						{user.has_yard !== undefined ? (user.has_yard ? 'Si' : 'No') : ''}
					</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Principal alimentación de mascotas:</Text>
					<Text style={styles.aptitudeText}>{user.main_pet_food}</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Gastos mensuales por mascota:</Text>
					<Text style={styles.aptitudeText}>
						$ {user.pet_expenses < 0 ? '' : user.pet_expenses}
					</Text>
				</View>
				<Divider />
				<View style={styles.aptitudeFieldView}>
					<Text style={styles.aptitudeFieldText}>Motivación por adoptar:</Text>
					<Text style={styles.aptitudeText}>{user.motivation}</Text>
				</View>
				<Divider />
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
		</ScrollView>
	);
}
