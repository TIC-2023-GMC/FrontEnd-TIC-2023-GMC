/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicationScreen } from '../models/InterfacesModels';

export interface IFavoritesRepository {
	create(_pub_id: string): Promise<void | any>;
	delete(_Pud_id: string): Promise<void | any>;
	find(_pageParam: number, _pageSize: number): Promise<PublicationScreen | any>;
}
