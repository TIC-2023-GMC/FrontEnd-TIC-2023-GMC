import { LeaderBoard, QuizGameMatch } from '../models/InterfacesModels';

export interface IMatchRespository {
	find(): Promise<QuizGameMatch>;
	findLeaderboard(): Promise<LeaderBoard>;
	update(_quizzGame: QuizGameMatch): Promise<void>;
}
