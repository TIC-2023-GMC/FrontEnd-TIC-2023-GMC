import { QuizGameMatch, LeaderBoard } from '../../domain/models/InterfacesModels';
import { IMatchRespository } from '../../domain/repositories/IMatchRepository';
import { get, put } from '../services/api';
import {
	getLeaderBoardEndpoint,
	getQuizGameByUserEndpoint,
	getQuizGameEndpoint
} from '../services/endpoints';

export class AxiosMatchRepository implements IMatchRespository {
	find = async (): Promise<QuizGameMatch> => {
		const response = await get<QuizGameMatch>(getQuizGameByUserEndpoint());
		return response.data;
	};

	findLeaderboard = async (): Promise<LeaderBoard> => {
		const response = await get<LeaderBoard>(getLeaderBoardEndpoint());
		return response.data;
	};

	update(quizzGame: QuizGameMatch): Promise<void> {
		const response = put<QuizGameMatch>(getQuizGameEndpoint(), quizzGame).then((response) => {
			response.data;
		});
		return response;
	}
}
