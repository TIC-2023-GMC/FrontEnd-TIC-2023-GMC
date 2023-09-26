import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { SaveOrRemoveFavoriteProps } from '../../domain/models/InterfacesModels';
import { inject, injectable } from 'tsyringe';
import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';

@injectable()
export class SaveAsFavoriteUseCase {
	constructor(@inject('FavoritesRepository') private repository: IFavoritesRepository) {
		this.repository = repository;
	}

	useMutationSaveAsFavorite(
		setVisibleSnackBar?: (_value: [boolean, boolean]) => void,
		setVisibleSingleSnackBar?: Dispatch<SetStateAction<boolean>>
	) {
		const queryClient = useQueryClient();

		const savePublicationAsFavoriteMutation = useMutation({
			mutationFn: (data: SaveOrRemoveFavoriteProps) =>
				this.repository.saveAsFavorite(data).then((response) => response.data),
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
	constructor(@inject('FavoritesRepository') private repository: IFavoritesRepository) {
		this.repository = repository;
	}

	useMutationRemoveFromFavorites(
		setVisibleSnackBar?: (_value: [boolean, boolean]) => void,
		setVisibleSingleSnackBar?: Dispatch<SetStateAction<boolean>>
	) {
		const queryClient = useQueryClient();

		const removePublicationFromFavoritesMutation = useMutation({
			mutationFn: (data: SaveOrRemoveFavoriteProps) =>
				this.repository.removeFromFavorites(data).then((response) => response.data),
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
	constructor(@inject('FavoritesRepository') private repository: IFavoritesRepository) {
		this.repository = repository;
	}

	useQueryFavorites(pageSize: number, userId: string) {
		return useInfiniteQuery({
			queryKey: ['Favorites'],
			queryFn: async ({ pageParam = 1 }) => {
				return this.repository.listFavorites(pageParam, pageSize, userId);
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
