import { inject, injectable } from 'tsyringe';
import { IWordSearchMatchRepository } from '../../domain/repositories/IWordSearchMatchRepository';
import { useQuery } from '@tanstack/react-query';
import { IWordSearchStore } from '../../domain/services/IWordSearchStore';

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

@injectable()
export class GetWordSearchStoreUseCase {
	constructor(@inject('WordSearchStore') private _service: IWordSearchStore) {}

	useWordSearchStore() {
		return this._service;
	}
}
