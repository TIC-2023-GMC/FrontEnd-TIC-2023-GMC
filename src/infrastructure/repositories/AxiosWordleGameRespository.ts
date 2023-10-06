import { WordleGame } from '../../domain/models/InterfacesModels';
import { IWordleGameRepository } from '../../domain/repositories/IWordleGameRepository';
import { get } from '../services/api';
import { getWordleGameEndpoint } from '../services/endpoints';

export default class AxiosWordleGameRepository implements IWordleGameRepository {
	async find() {
		const { data } = await get<WordleGame>(getWordleGameEndpoint());
		return data;
	}
}
