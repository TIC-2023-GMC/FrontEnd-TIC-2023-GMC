import { useInfiniteQuery } from '@tanstack/react-query';
import { inject, injectable } from 'tsyringe';
import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository';
@injectable()
export class ListOrganizationUseCase {
	constructor(@inject('OrganizationRepository') private _repository: IOrganizationRepository) {}
	useQueryOrganization(pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Organization'],
			queryFn: async ({ pageParam = 1 }) => this._repository.find(pageParam, pageSize),
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1] + 1;
				}
				return undefined;
			}
		});
	}
}
