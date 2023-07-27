import { Menu } from 'react-native-paper';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TabNavigation } from '../models/types';

export default function MenuAdd({
	children,
	visible,
	closeMenu
}: {
	children: React.ReactNode;
	visible: boolean;
	closeMenu: () => void;
}) {
	const navigation = useNavigation<NavigationProp<TabNavigation>>();

	return (
		<Menu visible={visible} onDismiss={closeMenu} anchor={children}>
			<Menu.Item
				onPress={() => {
					navigation.navigate('Agregar Publicación', { screen: 'Agregar Adopción' });
					closeMenu();
				}}
				title="Agregar Adopción"
			/>
			<Menu.Item
				onPress={() => {
					navigation.navigate('Agregar Publicación', { screen: 'Agregar Experiencia' });
					closeMenu();
				}}
				title="Agregar Experiencia"
			/>
		</Menu>
	);
}
