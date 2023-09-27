import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AddCommentProps } from '../../domain/models/InterfacesModels';
import { inject, injectable } from 'tsyringe';
import { ICommentsRepository } from '../../domain/repositories/ICommentsRepository';

@injectable()
export class AddCommentUseCase {
	constructor(@inject('CommentsRepository') private repository: ICommentsRepository) {
		this.repository = repository;
	}

	useMutationAddComment() {
		const addCommentMutation = useMutation({
			mutationFn: (data: AddCommentProps) =>
				this.repository.addComment(data).then((response) => response.data),
			onError: (error) => {
				console.log(error);
			}
		});
		return { addCommentMutation };
	}
}

@injectable()
export class ListCommentsUseCase {
	constructor(@inject('CommentsRepository') private repository: ICommentsRepository) {
		this.repository = repository;
	}

	useQueryComments(visible: boolean, pubId: string, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Comments'],
			queryFn: async ({ pageParam = 1 }) => {
				return this.repository.listComments(pageParam, pageSize, pubId);
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

/* export function useMutationComment() {
	const addCommentMutation = useMutation({
		mutationFn: (data: AddCommentProps) => {
			return post(getAddCommentEndpoint(), data).then((response) => response.data);
		},
		onError: (error) => {
			console.log(error);
		}
	});
	return { addCommentMutation };
} 

export function useQueryComment(visible: boolean, pubId: string, pageSize: number) {
	return useInfiniteQuery({
		queryKey: ['Comments'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await get<CommentsResults>(
				getListCommentsEndpoint({ pubId, pageParam, pageSize })
			);
			return response.data;
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

*/
