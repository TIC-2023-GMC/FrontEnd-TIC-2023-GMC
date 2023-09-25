import {
	AdoptionFilter,
	Publication,
	PublicationScreen
} from '../../domain/models/InterfacesModels';
import { IPublicationRepository } from '../../domain/repositories/IPublicationRepository';
import { get, post } from '../services/api';
import { getAddAdoptionEndpoint, getListAdoptionsEndpoint } from '../services/endpoints';

export class AxiosAdoptionRepository implements IPublicationRepository {
	create(_publication: Publication): Promise<void> {
		return post(getAddAdoptionEndpoint(), _publication);
	}
	async find(
		_pageParam: number,
		_pageSize: number,
		_filter: AdoptionFilter
	): Promise<PublicationScreen> {
		const newDate = _filter?.date ? new Date(_filter?.date) : undefined;
		const response = await get<PublicationScreen>(
			getListAdoptionsEndpoint({
				pageParam: _pageParam,
				filter: _filter,
				pageSize: _pageSize,
				newDate: newDate
			})
		);
		return response.data;
	}
}
