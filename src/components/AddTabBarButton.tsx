/* eslint-disable react-native/no-unused-styles */
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';

export default function AddTabBarButton(props: BottomTabBarButtonProps) {
	const theme = useTheme();
	const styles = createStyles(theme);
	return (
		<View style={styles.addButtonContainer}>
			<TouchableWithoutFeedback onPress={props.onPress}>
				<View style={styles.addButton}>
					<AntDesign {...styles.icon} name="plus" size={35} />
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}
const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		addButtonContainer: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		addButton: {
			borderColor: theme.colors.secondary,
			borderWidth: 3.5,
			width: 60,
			height: 65,
			borderRadius: 35,
			backgroundColor: theme.colors.primary,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 6
		},
		icon: {
			color: theme.colors.secondary
		}
	});
