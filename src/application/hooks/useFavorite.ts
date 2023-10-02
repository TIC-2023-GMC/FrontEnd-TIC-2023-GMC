import { QueryClient, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { inject, injectable } from 'tsyringe';
import { AdoptionPublication } from '../../domain/models/InterfacesModels';
import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { publicationTypes } from './useLike';

@injectable()
export class SaveAsFavoriteUseCase {
	constructor(@inject('FavoritesRepository') private _repository: IFavoritesRepository) {}

	useMutationSaveAsFavorite(
		publicationType: string,
		setVisibleSnackBar?: (_value: [boolean, boolean]) => void,
		setVisibleSingleSnackBar?: Dispatch<SetStateAction<boolean>>
	) {
		const queryClient = useQueryClient();
		const savePublicationAsFavoriteMutation = useMutation({
			mutationFn: (pub_id: string) =>
				this._repository.create(pub_id).then((response) => response.data),
			onMutate: (pub_id: string) => {
				publicationTypes
					.filter((type) => type !== publicationType)
					.forEach((type) => {
						updateFavoriteCache(type, pub_id, queryClient);
					});
				return updateFavoriteCache(publicationType, pub_id, queryClient);
			},
			onSuccess: () => {
				if (setVisibleSnackBar !== undefined) {
					setVisibleSnackBar([true, false]);
				} else if (setVisibleSingleSnackBar !== undefined) {
					setVisibleSingleSnackBar(true);
				}
				queryClient.invalidateQueries({ queryKey: ['Favorites'] });
			},
			onError: (error) => {
				console.log(error);
			}
		});
		return {
			savePublicationAsFavoriteMutation
		};
	}
}

@injectable()
export class RemoveFromFavoritesUseCase {
	constructor(@inject('FavoritesRepository') private _repository: IFavoritesRepository) {}

	useMutationRemoveFromFavorites(
		publicationType: string,
		setVisibleSnackBar?: (_value: [boolean, boolean]) => void,
		setVisibleSingleSnackBar?: Dispatch<SetStateAction<boolean>>
	) {
		const queryClient = useQueryClient();

		const removePublicationFromFavoritesMutation = useMutation({
			mutationFn: (pub_id: string) =>
				this._repository.delete(pub_id).then((response) => response.data),
			onMutate: (pub_id: string) => {
				publicationTypes
					.filter((type) => type !== publicationType)
					.forEach((type) => {
						updateFavoriteCache(type, pub_id, queryClient);
					});
				return updateFavoriteCache(publicationType, pub_id, queryClient);
			},
			onSuccess: () => {
				if (setVisibleSnackBar !== undefined) {
					setVisibleSnackBar([false, true]);
				} else if (setVisibleSingleSnackBar !== undefined) {
					setVisibleSingleSnackBar(true);
				}
				queryClient.invalidateQueries({ queryKey: ['Favorites'] });
			},
			onError: (error) => {
				console.log(error);
			}
		});
		return {
			removePublicationFromFavoritesMutation
		};
	}
}

@injectable()
export class ListFavoritesUseCase {
	constructor(@inject('FavoritesRepository') private _repository: IFavoritesRepository) {}

	useQueryFavorites(pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Favorites'],
			queryFn: async ({ pageParam = 1 }) => {
				return this._repository.find(pageParam, pageSize);
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			},
			refetchOnWindowFocus: true,
			refetchIntervalInBackground: true,
			refetchOnMount: 'always'
		});
	}
}

async function updateFavoriteCache(
	publicationType: string,
	pubId: string,
	queryClient: QueryClient
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
							if (pub._id === pubId) {
								return {
									...pub,
									is_favorite: !pub.is_favorite
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
