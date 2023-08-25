import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { baseUrl } from '../services/api';
import React, { RefObject } from 'react';
import { CommonActions, NavigationProp } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import { View } from 'react-native';
import * as Sharing from 'expo-sharing';

export function parseNumber(value: string) {
	const valueNumber = parseInt(value);
	if (isNaN(valueNumber)) {
		return '';
	}
	return valueNumber;
}

export const uploadImg = async (
	uri: string,
	setError: React.Dispatch<React.SetStateAction<string>>
) => {
	try {
		const response = await uploadAsync(`${baseUrl}/photo/upload`, uri, {
			fieldName: 'photo',
			httpMethod: 'POST',
			uploadType: FileSystemUploadType.MULTIPART,
			headers: {
				'Content-Type': 'multipart'
			}
		});
		return response.body;
	} catch (error) {
		console.log(error);

		setError('Error al subir la imagen');
	}
};

const snapShot = async (ref: RefObject<View>) => {
	try {
		return await captureRef(ref, {
			format: 'png',
			result: 'tmpfile'
		});
	} catch (error) {
		console.log(error);
	}
};
const shareImage = async (uri: string) => {
	try {
		await Sharing.shareAsync(uri);
	} catch (error) {
		console.log(error);
	}
};

export const snapShotAndShare = async (ref: RefObject<View>) => {
	await shareImage((await snapShot(ref)) || '');
};

export const resetNavigationStack = (
	navigation: NavigationProp<ReactNavigation.RootParamList>,
	route: string
) => {
	navigation.dispatch(
		CommonActions.reset({
			index: 0,
			routes: [{ name: route }]
		})
	);
};
