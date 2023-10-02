/* eslint-disable @typescript-eslint/no-explicit-any */

import { LeaderBoard, QuizGameMatch, User } from '../models/InterfacesModels';

export interface IMatchRespository {
	find(): Promise<QuizGameMatch>;
	findLeaderboard(): Promise<LeaderBoard>;
	putScore(quizzGame: QuizGameMatch): Promise<void>;
}
