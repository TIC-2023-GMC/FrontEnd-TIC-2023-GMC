import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { IconButton, MD3Theme, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface PhotoSelectionProps {
	image: string | undefined;
	setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function PhotoSelection({ image, setImage }: PhotoSelectionProps) {
	const theme = useTheme();
	const styles = createStyles(theme);
	const pickImages = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			selectionLimit: 1,
			aspect: [4, 3],
			quality: 1
		});

		if (!result.canceled) {
			setImage(result.assets?.pop()?.uri);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={{ uri: image }} style={styles.image} />
			<IconButton
				onPress={pickImages}
				size={30}
				icon="image-plus"
				mode="contained"
				containerColor={theme.colors.secondary}
				iconColor={theme.colors.primary}
			/>
		</View>
	);
}

const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			marginTop: 10,
			justifyContent: 'center',
			alignItems: 'center'
		},
		image: {
			width: 240,
			height: 180,
			borderWidth: 1,
			borderColor: theme.colors.tertiary,
			borderRadius: 10
		}
	});
