/* eslint-disable @typescript-eslint/no-explicit-any */
import { Game } from '../models/InterfacesModels';

export interface IGameRepository {
	get(): Promise<Game[]>;
}
