import { inject, injectable } from 'tsyringe';
import { IMatchRespository } from '../../domain/repositories/IMatchRepository';
import { QuizGameMatch, User } from '../../domain/models/InterfacesModels';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

@injectable()
export class GetQuizGameMatchUsecase {
	constructor(@inject('MatchRepository') private _repository: IMatchRespository) { }
	useQueryQuizGame(
		setQuizzGame: (
			_value: QuizGameMatch
		) => void,
		updateQuestion: (
			_value: QuizGameMatch
		) => void
	) {
		const { isLoading, isFetching } = useQuery({
			queryKey: ['question'],
			queryFn: async () => {
				return this._repository.find();;
			},
			onSuccess: (data: QuizGameMatch) => {
				data.match_game_score = 0;
				data.match_game_time = 0;
				setQuizzGame(data);
				updateQuestion(data);
			}
		});
		const loading = isLoading || isFetching;
		return { loading };
	}
}

@injectable()
export class GetLeaderboardUsecase {
	constructor(@inject('MatchRepository') private _repository: IMatchRespository) { }
	useQueryLeaderboard(sendScoreQuizzGameIsSuccess: boolean) {
		return useQuery({
			queryKey: ['leaderboard'],
			queryFn: async () => {
				return this._repository.findLeaderboard();
			},
			enabled: sendScoreQuizzGameIsSuccess
		});
	}
}

@injectable()
export class SendScoreQuizzGameUsecase {
	constructor(@inject('MatchRepository') private _repository: IMatchRespository) { }
	useMutationSendScoreQuizzGame() {
		const sendScoreQuizzGame = useMutation({
			mutationFn: this._repository.update
		});
		return { sendScoreQuizzGame };
	}
}

export function useQuizGame(user: User) {
	const [quizzGame, setQuizzGame] = useState<QuizGameMatch>({
		_id: '',
		user_id: user._id ?? '',
		match_name: '',
		match_game_score: 0,
		match_game_time: 0,
		match_game_onboarding: '',
		match_game_questions: []
	});
	const changeScore = (is_correct: boolean) =>
		setQuizzGame((prevQuizzGame) => {
			if (is_correct) {
				const object: QuizGameMatch = {
					...prevQuizzGame,
					match_game_score: prevQuizzGame.match_game_score + 1
				};
				return object;
			}
			return prevQuizzGame;
		});
	const changeTime = (totalSeconds: number) =>
		setQuizzGame((prevQuizzGame) => {
			const object: QuizGameMatch = {
				...prevQuizzGame,
				match_game_time: totalSeconds,

				match_game_score: Math.round(
					prevQuizzGame.match_game_score * 10 +
					(10 * Math.pow(prevQuizzGame.match_game_score, 2)) / totalSeconds
				)
			};
			return object;
		});
	return { quizzGame, changeScore, changeTime, setQuizzGame };
}

export function useQuestion() {
	const [question, setQuestion] = useState<number>(-1);
	const updateQuestion = (data: QuizGameMatch) => {
		setQuestion(data?.match_game_questions?.length ? data?.match_game_questions?.length - 1 : 0);
	};
	const changeQuestion = () =>
		setQuestion((prevQuestion) => (prevQuestion === 0 ? 0 : prevQuestion - 1));

	return { question, changeQuestion, updateQuestion };
}
