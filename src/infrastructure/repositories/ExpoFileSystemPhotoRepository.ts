import { FileSystemUploadType, uploadAsync } from 'expo-file-system';
import { Photo, Token } from '../../domain/models/InterfacesModels';
import { IPhotoRepository } from '../../domain/repositories/IPhotoRepository';
import { baseUrl } from '../services/api';

export class ExpoFileSystemPhotoRepository implements IPhotoRepository {
	async create(_uri: string, _token: Token): Promise<Photo> {
		const response = await uploadAsync(`${baseUrl}/photo/upload`, _uri, {
			fieldName: 'photo',
			httpMethod: 'POST',
			uploadType: FileSystemUploadType.MULTIPART,
			headers: {
				'Content-Type': 'multipart',
				Authorization: `${_token.token_type} ${_token.access_token}`
			}
		});
		const photo: Photo = JSON.parse(response.body ?? '{}');
		return photo;
	}
}
