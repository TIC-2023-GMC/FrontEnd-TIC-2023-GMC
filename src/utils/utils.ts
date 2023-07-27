import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { baseUrl } from '../services/api';
import React from 'react';

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
