import { Game } from '../../domain/models/InterfacesModels';
import { IGameRepository } from '../../domain/repositories/IGameRepository';
import { get } from '../services/api';
import { getGamesEndpoint } from '../services/endpoints';

export class AxiosGameRepository implements IGameRepository {
	get = async (): Promise<Game[]> => {
		const response = await get<Game[]>(getGamesEndpoint());
		return response.data;
	};
}
