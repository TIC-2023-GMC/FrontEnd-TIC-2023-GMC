import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import { Game } from '../../domain/models/InterfacesModels';
import { IGameRepository } from '../../domain/repositories/IGameRepository';
import { IWordleGameStoreService } from '../../domain/repositories/IWordleGameStoreService';

@injectable()
export class GetGamesUseCase {
	constructor(@inject('GameRepository') private _repository: IGameRepository) {}
	useQueryGames() {
		const [games, setGames] = useState<Game[]>();
		const { isLoading, isFetching } = useQuery({
			queryKey: ['listGames'],
			queryFn: async () => {
				return this._repository.find();
			},
			onSuccess: (data: Game[]) => {
				setGames(data);
			}
		});
		const loading = isLoading || isFetching;
		return { loading, games };
	}
}
@injectable()
export class GetWordleGameStoreUseCase {
	constructor(@inject('WordleGameStore') private _service: IWordleGameStoreService) {}
	useWordleGameStore() {
		return this._service;
	}
}
// @injectable()
// export class GetWordleWordsUseCase {
// 	constructor(@inject('WordleGameRepository') private _repository: IWordleGameRepository) {}
// 	useWordleWords() {
// 		return useQuery({
// 			queryKey: ['initWordleGame'],
// 			queryFn: this._repository.find
// 		});
// 	}
// }
