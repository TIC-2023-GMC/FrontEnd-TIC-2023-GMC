import React, { useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface PhotoSelectionProps {
	image: ImagePicker.ImagePickerResult | undefined;
	setImage: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerResult | undefined>>;
}

export default function PhotoSelection({ image, setImage }: PhotoSelectionProps) {
	const pickImages = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			selectionLimit: 1,
			aspect: [4, 3],
			quality: 1
		});
		if (!result.canceled) {
			setImage(result);
		}
	};
	return (
		<View style={styles.container}>
			<Image source={{ uri: image?.assets?.pop()?.uri }} style={styles.image} />
			<IconButton onPress={pickImages} size={30} icon="image-plus" mode="contained-tonal" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		width: 240,
		height: 180,
		borderWidth: 1,
		borderColor: '#000000',
		borderRadius: 10
	}
});

