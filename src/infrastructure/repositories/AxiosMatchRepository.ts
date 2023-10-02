import { User, QuizGameMatch, LeaderBoard } from '../../domain/models/InterfacesModels';
import { IMatchRespository } from '../../domain/repositories/IMatchRepository';
import { get, put } from '../services/api';
import { getQuizGameByUserEndpoint, getQuizGameEndpoint } from '../services/endpoints';

export class AxiosMatchRepository implements IMatchRespository {
	find = async (): Promise<QuizGameMatch> => {
		const response = await get<QuizGameMatch>(getQuizGameByUserEndpoint());
		return response.data;
	};

	findLeaderboard = async (): Promise<LeaderBoard> => {
		const response = await get<LeaderBoard>(getQuizGameByUserEndpoint());
		return response.data;
	};

	putScore(quizzGame: QuizGameMatch): Promise<void> {
		const response = put<QuizGameMatch>(getQuizGameEndpoint(), quizzGame).then((response) => {
			response.data;
		});
		return response;
	}
}
