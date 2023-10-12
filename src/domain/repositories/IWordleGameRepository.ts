import { WordleGame } from '../models/InterfacesModels';

export interface IWordleGameRepository {
	find(): Promise<WordleGame>;
	update(_wordleGame: WordleGame): Promise<void>;
}
