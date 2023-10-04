import * as SecureStore from 'expo-secure-store';
import { Token } from '../../domain/models/InterfacesModels';
import { IInternalStoreRepository } from '../../domain/repositories/IInternalStoreRepository';
export class ExpoStoreRepository implements IInternalStoreRepository {
	get(_key: string): Promise<string | null> {
		try {
			const token = SecureStore.getItemAsync(_key);
			return token;
		} catch (error) {
			console.error('Error al obtener el token desde SecureStore:', error);
			return Promise.resolve(null);
		}
	}
	async set(_key: string, _value: Token): Promise<void> {
		const token = JSON.stringify(_value);
		try {
			await SecureStore.setItemAsync(_key, token);
		} catch (error) {
			console.error('Error al guardar el valor en SecureStore:', error);
		}
	}
	remove(_key: string): void {
		try {
			SecureStore.deleteItemAsync(_key);
		} catch (error) {
			console.error('Error al eliminar el valor desde SecureStore:', error);
		}
	}
}
