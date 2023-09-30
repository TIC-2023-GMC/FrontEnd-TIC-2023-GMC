/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameScreen } from '../models/InterfacesModels';

export interface IGameRepository {
	get(): Promise<GameScreen>;
}
