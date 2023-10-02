import { PublicationScreen } from '../../domain/models/InterfacesModels';
import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { del, get, post } from '../services/api';
import {
	getAddFavoriteAdoptionEndpoint,
	getListFavoritesAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint
} from '../services/endpoints';

export class AxiosFavoritesRepository implements IFavoritesRepository {
	create(_pub_id: string): Promise<void> {
		return post(getAddFavoriteAdoptionEndpoint(), { pub_id: _pub_id });
	}
	delete(_pub_id: string): Promise<void> {
		return del(getRemoveFavoriteAdoptionEndpoint(), { data: { pub_id: _pub_id } });
	}
	async find(_pageParam: number, _pageSize: number): Promise<PublicationScreen> {
		const response = await get<PublicationScreen>(
			getListFavoritesAdoptionsEndpoint({
				pageParam: _pageParam,
				pageSize: _pageSize
			})
		);
		return response.data;
	}
}
