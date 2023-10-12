import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import { Game } from '../../domain/models/InterfacesModels';
import { IGameRepository } from '../../domain/repositories/IGameRepository';

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
