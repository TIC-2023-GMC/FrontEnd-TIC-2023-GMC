import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddOrRemoveLikeProps, AdoptionPublication, Like } from '../models/InterfacesModels';
import { del, post } from '../services/api';
import { getAddLikeEndpoint, getRemoveLikeEndpoint } from '../services/endpoints';

const publicationTypes = ['Adoption', 'Favorites', 'MyPublications'];
export function useLike(publicationType: string) {
	const queryClient = useQueryClient();
	const addLikeMutation = useMutation({
		mutationFn: (data: AddOrRemoveLikeProps) => {
			return post(
				getAddLikeEndpoint({
					userId: data.user_id,
					pubId: data.pub_id,
					isAdoption: data.is_adoption
				})
			).then((response) => response.data);
		},
		onMutate: async (data) => {
			publicationTypes
				.filter((type) => type !== publicationType)
				.forEach((type) => {
					addLikeCache(type, data, queryClient);
				});

			return addLikeCache(publicationType, data, queryClient);
		},

		onError: (error, newData, context) => {
			queryClient.setQueryData([publicationType], context?.previousValue);
		}
	});

	const removeLikeMutation = useMutation({
		mutationFn: (data: AddOrRemoveLikeProps) => {
			return del(
				getRemoveLikeEndpoint({
					userId: data.user_id,
					pubId: data.pub_id,
					isAdoption: data.is_adoption
				})
			).then((response) => response.data);
		},
		onMutate: async (data) => {
			publicationTypes
				.filter((type) => type !== publicationType)
				.forEach((type) => {
					removeLikeCache(type, data, queryClient);
				});
			return removeLikeCache(publicationType, data, queryClient);
		},
		onError: (error, newData, context) => {
			queryClient.setQueryData([publicationType], context?.previousValue);
		}
	});

	return { addLikeMutation, removeLikeMutation };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addLikeCache(publicationType: string, data: AddOrRemoveLikeProps, queryClient: any) {
	await queryClient.cancelQueries({ queryKey: [publicationType] });
	const previousValue = queryClient.getQueryData([publicationType]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	previousValue &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryClient.setQueryData([publicationType], (old: any) => {
			return {
				...old,
				pages: old.pages.map((page: [AdoptionPublication[], number]) => {
					return [
						page[0].map((pub: AdoptionPublication) => {
							if (pub._id === data.pub_id) {
								const updatedLikes = [...pub.likes];
								const existingLike = updatedLikes.find((like) => like.user_id === data.user_id);
								if (!existingLike) {
									updatedLikes.push({ user_id: data.user_id });
								}
								return {
									...pub,
									likes: updatedLikes
								};
							}
							return pub;
						}),
						page[1]
					];
				})
			};
		});
	return { previousValue };
}

async function removeLikeCache(
	publicationType: string,
	data: AddOrRemoveLikeProps,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	queryClient: any
) {
	await queryClient.cancelQueries({ queryKey: [publicationType] });
	const previousValue = queryClient.getQueryData([publicationType]);
	previousValue &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		queryClient.setQueryData([publicationType], (old: any) => {
			return {
				...old,
				pages: old.pages.map((page: [AdoptionPublication[], number]) => {
					return [
						page[0].map((pub: AdoptionPublication) => {
							if (pub._id === data.pub_id) {
								return {
									...pub,
									likes: pub.likes.filter((like: Like) => like.user_id !== data.user_id)
								};
							}
							return pub;
						}),
						page[1]
					];
				})
			};
		});
	return { previousValue };
}
