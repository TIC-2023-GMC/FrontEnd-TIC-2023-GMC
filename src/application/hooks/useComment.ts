import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AddCommentProps } from '../../domain/models/InterfacesModels';
import { inject, injectable } from 'tsyringe';
import { ICommentsRepository } from '../../domain/repositories/ICommentsRepository';

@injectable()
export class AddCommentUseCase {
	constructor(@inject('CommentsRepository') private _repository: ICommentsRepository) {}

	useMutationAddComment() {
		const addCommentMutation = useMutation({
			mutationFn: (data: AddCommentProps) =>
				this._repository.create(data).then((response) => response.data),
			onError: (error) => {
				console.log(error);
			}
		});
		return { addCommentMutation };
	}
}

@injectable()
export class ListCommentsUseCase {
	constructor(@inject('CommentsRepository') private _repository: ICommentsRepository) {}

	useQueryComments(visible: boolean, pubId: string, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Comments'],
			queryFn: async ({ pageParam = 1 }) => {
				return this._repository.find(pageParam, pageSize, pubId);
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			},
			enabled: visible
		});
	}
}
