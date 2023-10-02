import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, MD3Theme, Snackbar, useTheme } from 'react-native-paper';

const OpenSocialButton = () => {
	const theme = useTheme();
	const styles = useStyles(theme);
	const [visible, setVisible] = useState(false);

	const handleOpenURL = (url: string) => {
		Linking.canOpenURL(url)
			.then((supported: boolean) => {
				if (!supported) {
					console.log('No se puede abrir la url');
				} else {
					return Linking.openURL(url);
				}
			})
			.catch((err: Error) => console.log(err));
	};

	return (
		<View style={styles.container}>
			<IconButton
				mode="contained"
				icon="facebook"
				onPress={() => handleOpenURL('https://www.facebook.com/UBAdeQuito')}
			/>
			<IconButton
				mode="contained"
				icon="instagram"
				onPress={() => handleOpenURL('https://www.instagram.com/uba_quito')}
			/>
			<IconButton
				mode="contained"
				icon="twitter"
				onPress={() => handleOpenURL('https://www.twitter.com/UBA_Quito')}
			/>
			<Snackbar visible={visible} onDismiss={() => setVisible(false)}>
				Existió un error al abrir la red social
			</Snackbar>
		</View>
	);
};
const useStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			paddingVertical: 10,
			paddingHorizontal: 10
		},
		button: {
			width: '30%',
			backgroundColor: theme.colors.primary
		}
	});
export default OpenSocialButton;
