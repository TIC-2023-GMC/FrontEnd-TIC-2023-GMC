import { WordSearchMatch } from '../../domain/models/InterfacesModels';
import { IWordSearchMatchRepository } from '../../domain/repositories/IWordSearchMatchRepository';
import { get } from '../services/api';
import { getWordSearchGameEndpoint } from '../services/endpoints';

export class AxiosWordSearchMatchRepository implements IWordSearchMatchRepository {
	find = async (): Promise<WordSearchMatch> => {
		const response = await get<WordSearchMatch>(getWordSearchGameEndpoint());
		return response.data;
	};
}
