import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AddCommentProps } from '../../domain/models/InterfacesModels';
import {
	getAddCommentEndpoint,
	getListCommentsEndpoint
} from '../../infrastructure/services/endpoints';
import { get, post } from '../../infrastructure/services/api';
interface CommentsResults {
	0: Comment[];
	1: number;
}

export function useMutationComment() {
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
