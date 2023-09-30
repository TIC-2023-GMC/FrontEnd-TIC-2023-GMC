/* eslint-disable @typescript-eslint/no-explicit-any */
import { Game } from '../models/InterfacesModels';

export interface IGameRepository {
	find(): Promise<Game[]>;
}
