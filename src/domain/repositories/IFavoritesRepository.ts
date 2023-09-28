/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicationScreen, SaveOrRemoveFavoriteProps } from '../models/InterfacesModels';

export interface IFavoritesRepository {
	create(_data: SaveOrRemoveFavoriteProps): Promise<void | any>;
	delete(_data: SaveOrRemoveFavoriteProps): Promise<void | any>;
	find(_pageParam: number, _pageSize: number, _userId: string): Promise<PublicationScreen | any>;
}
