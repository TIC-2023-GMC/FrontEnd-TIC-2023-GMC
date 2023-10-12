import { WordleGame } from '../../domain/models/InterfacesModels';
import { IWordleGameRepository } from '../../domain/repositories/IWordleGameRepository';
import { get, put } from '../services/api';
import { getWordleGameEndpoint, putWordleGameEndpoint } from '../services/endpoints';

export default class AxiosWordleGameRepository implements IWordleGameRepository {
	async find() {
		const response = await get<WordleGame>(getWordleGameEndpoint());
		return response.data;
	}

	async update(wordleGame: WordleGame): Promise<void> {
		const response = put<WordleGame>(putWordleGameEndpoint(), wordleGame).then((response) => {
			response.data;
		});
		return response;
	}
}
