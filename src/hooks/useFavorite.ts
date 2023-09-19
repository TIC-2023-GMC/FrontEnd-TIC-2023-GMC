import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { AdoptionPublication, SaveOrRemoveFavoriteProps } from '../models/InterfacesModels';
import { del, get, post } from '../services/api';
import {
	getAddFavoriteAdoptionEndpoint,
	getListFavoritesAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint
} from '../services/endpoints';
interface FavoritesScreenValues {
	0: AdoptionPublication[];
	1: number;
}

export function useFavorite(
	// eslint-disable-next-line no-unused-vars
	setVisibleSnackBar?: (value: [boolean, boolean]) => void,
	setVisibleSingleSnackBar?: Dispatch<SetStateAction<boolean>>
) {
	const queryClient = useQueryClient();
	const savePublicationAsFavoriteMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) => {
			return post(getAddFavoriteAdoptionEndpoint(), data).then((response) => response.data);
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

	const removePublicationFromFavoritesMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) =>
			del(getRemoveFavoriteAdoptionEndpoint(), { data: data }).then((response) => response.data),
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

	return { savePublicationAsFavoriteMutation, removePublicationFromFavoritesMutation };
}

export function useQueryFavorite(pageSize: number, user_id: string) {
	return useInfiniteQuery({
		queryKey: ['Favorites'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await get<FavoritesScreenValues>(
				getListFavoritesAdoptionsEndpoint({ pageParam, pageSize, user_id })
			);

			return response.data;
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
