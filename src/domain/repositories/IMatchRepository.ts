/* eslint-disable @typescript-eslint/no-explicit-any */

import { LeaderBoard, QuizGameMatch, User } from '../models/InterfacesModels';

export interface IMatchRespository {
	find(user: User): Promise<QuizGameMatch>;
	findLeaderboard(user: User): Promise<LeaderBoard>;
	putScore(quizzGame: QuizGameMatch): Promise<void>;
}
