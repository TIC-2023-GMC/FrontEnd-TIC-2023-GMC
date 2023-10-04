/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Publication, PublicationScreen } from '../models/InterfacesModels';

export interface IPublicationRepository {
	create(_publication: Publication): Promise<Publication | void | any>;
	find(_pageParam: number, _pageSize: number, _filter: Filter): Promise<PublicationScreen | any>;
}
