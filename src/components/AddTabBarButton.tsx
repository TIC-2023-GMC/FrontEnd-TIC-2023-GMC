/* eslint-disable react-native/no-unused-styles */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, MD3Theme, useTheme } from 'react-native-paper';
import MenuAdd from './MenuAdd';

export default function AddTabBarButton() {
	const theme = useTheme();
	const styles = createStyles(theme);
	const [visible, setVisible] = useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);
	return (
		<MenuAdd visible={visible} closeMenu={closeMenu}>
			<IconButton
				onPress={openMenu}
				size={40}
				icon="plus"
				style={styles.addButton}
				iconColor={theme.colors.secondary}
				animated={true}
				mode="outlined"
			/>
		</MenuAdd>
	);
}
const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		addButton: {
			borderColor: theme.colors.secondary,
			height: 65,
			width: 60,
			borderWidth: 3.5,
			backgroundColor: theme.colors.primary,
			margin: 0
		}
	});
