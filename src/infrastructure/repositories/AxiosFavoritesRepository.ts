import { PublicationScreen, SaveOrRemoveFavoriteProps } from '../../domain/models/InterfacesModels';
import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { del, get, post } from '../services/api';
import {
	getAddFavoriteAdoptionEndpoint,
	getListFavoritesAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint
} from '../services/endpoints';

export class AxiosFavoritesRepository implements IFavoritesRepository {
	saveAsFavorite(_data: SaveOrRemoveFavoriteProps): Promise<void> {
		return post(getAddFavoriteAdoptionEndpoint(), _data);
	}
	removeFromFavorites(_data: SaveOrRemoveFavoriteProps): Promise<void> {
		return del(getRemoveFavoriteAdoptionEndpoint(), { data: _data });
	}
	async listFavorites(
		_pageParam: number,
		_pageSize: number,
		_userId: string
	): Promise<PublicationScreen> {
		const response = await get<PublicationScreen>(
			getListFavoritesAdoptionsEndpoint({
				pageParam: _pageParam,
				pageSize: _pageSize,
				user_id: _userId
			})
		);
		return response.data;
	}
}