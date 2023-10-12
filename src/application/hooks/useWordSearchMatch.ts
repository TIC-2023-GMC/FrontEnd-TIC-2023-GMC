import { inject, injectable } from 'tsyringe';
import { IWordSearchMatchRepository } from '../../domain/repositories/IWordSearchMatchRepository';
import { User, WordSearchMatch } from '../../domain/models/InterfacesModels';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

@injectable()
export class GetWordSearchGameMatchUseCase {
	constructor(
		@inject('WordSearchMatchRepository') private _repository: IWordSearchMatchRepository
	) {}

	useQueryWordSearchGame() {
		const { isLoading, isFetching, data } = useQuery({
			queryKey: ['wordSearchGameMatch'],
			queryFn: async () => {
				return this._repository.find();
			}
		});
		const loading = isLoading || isFetching;
		return { loading, data };
	}
}


