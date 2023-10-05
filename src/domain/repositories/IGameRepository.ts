import { Game } from '../models/InterfacesModels';

export interface IGameRepository {
	find(): Promise<Game[]>;
}
