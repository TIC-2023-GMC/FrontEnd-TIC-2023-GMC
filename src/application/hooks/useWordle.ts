import { useMutation, useQuery } from '@tanstack/react-query';
import { inject, injectable } from 'tsyringe';
import { IWordleGameRepository } from '../../domain/repositories/IWordleGameRepository';
import { WordleGame } from '../../domain/models/InterfacesModels';
import { useState } from 'react';
import { IWordleGameStoreService } from '../../domain/repositories/IWordleGameStoreService';

@injectable()
export class GetWordleGameStoreUseCase {
	constructor(@inject('WordleGameStore') private _service: IWordleGameStoreService) {}
	useWordleGameStore() {
		return this._service;
	}
}

@injectable()
export class GetWordleWordsUseCase {
	constructor(@inject('WordleGameRepository') private _repository: IWordleGameRepository) {}
	useQueryWordleWords() {
		const [wordle, setWordle] = useState<WordleGame>({
			_id: '',
			user_id: '',
			match_name: '',
			match_game_score: 0,
			match_game_time: 0,
			match_game_onboarding: '',
			wordle_game_clue: '',
			wordle_game_description: '',
			wordle_game_words: []
		});
		const { isLoading, isFetching } = useQuery({
			queryKey: ['wordle'],
			queryFn: async () => {
				return this._repository.find();
			},
			onSuccess: (data: WordleGame) => {
				setWordle(data);
			}
		});
		const loading = isLoading || isFetching;
		return { loading, wordle };
	}
}

@injectable()
export class sendScoreWordleGameUsecase {
	constructor(@inject('WordleGameRepository') private _repository: IWordleGameRepository) {}
	useMutationSendScoreWordleGame() {
		const sendScoreWordleGame = useMutation({
			mutationFn: this._repository.update
		});
		return { sendScoreWordleGame };
	}
}
