import { GameScreen } from '../../domain/models/InterfacesModels';
import { IGameRepository } from '../../domain/repositories/IGameRepository';
import { get } from '../services/api';
import { getGamesEndpoint } from '../services/endpoints';

export class AxiosGameRepository implements IGameRepository {
	get = async (): Promise<GameScreen> => {
		const response = await get<GameScreen>(getGamesEndpoint());
		return response.data;
	};
}
