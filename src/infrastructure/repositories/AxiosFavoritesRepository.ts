import { PublicationScreen, SaveOrRemoveFavoriteProps } from '../../domain/models/InterfacesModels';
import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { del, get, post } from '../services/api';
import {
	getAddFavoriteAdoptionEndpoint,
	getListFavoritesAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint
} from '../services/endpoints';

export class AxiosFavoritesRepository implements IFavoritesRepository {
	create(_data: SaveOrRemoveFavoriteProps): Promise<void> {
		return post(getAddFavoriteAdoptionEndpoint(), _data);
	}
	delete(_data: SaveOrRemoveFavoriteProps): Promise<void> {
		return del(getRemoveFavoriteAdoptionEndpoint(), { data: _data });
	}
	async find(_pageParam: number, _pageSize: number, _userId: string): Promise<PublicationScreen> {
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
