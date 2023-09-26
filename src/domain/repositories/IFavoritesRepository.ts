/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicationScreen, SaveOrRemoveFavoriteProps } from '../models/InterfacesModels';

export interface IFavoritesRepository {
	saveAsFavorite(_data: SaveOrRemoveFavoriteProps): Promise<void | any>;
	removeFromFavorites(_data: SaveOrRemoveFavoriteProps): Promise<void | any>;
	listFavorites(
		_pageParam: number,
		_pageSize: number,
		_userId: string
	): Promise<PublicationScreen | any>;
}
