import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AddCommentProps } from '../models/InterfacesModels';
import { get, post } from '../services/api';
import { getAddCommentEndpoint, getListCommentsEndpoint } from '../services/endpoints';
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

export function useQueryComment(
	visible: boolean,
	pubId: string,
	pageSize: number,
	isAdoption: boolean
) {
	return useInfiniteQuery({
		queryKey: ['Comments'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await get<CommentsResults>(
				getListCommentsEndpoint({ pubId, pageParam, pageSize, isAdoption })
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
