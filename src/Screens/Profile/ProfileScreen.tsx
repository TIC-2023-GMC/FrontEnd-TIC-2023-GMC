import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './ProfileScreen.styles';
import { Button } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TabNavigation } from '../../models/types';

export function ProfileScreen() {
	const navigation = useNavigation<NavigationProp<TabNavigation>>();
	return (
		<View style={styles.container}>
			<Text>Profile Screen</Text>
			<Button
				mode="contained"
				onPress={() => {
					navigation.navigate('Mis Publicaciones');
				}}
			>
				Mis Publicaciones
			</Button>
			<Button
				mode="contained"
				onPress={() => {
					navigation.navigate('Favoritos');
				}}
			>
				Mis Favoritos
			</Button>
			<Button
				mode="contained"
				onPress={() => {
					navigation.navigate('Editar Perfil');
				}}
			>
				Editar Perfil
			</Button>
		</View>
	);
}
