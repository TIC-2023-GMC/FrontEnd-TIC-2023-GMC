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
				iconColor={theme.colors.primary}
				animated={true}
				mode="outlined"
			/>
		</MenuAdd>
	);
}
const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		addButton: {
			height: 60,
			width: 60,
			borderRadius: 30,
			borderWidth: 0,
			backgroundColor: theme.colors.secondary,
			marginVertical: 5
		}
	});
