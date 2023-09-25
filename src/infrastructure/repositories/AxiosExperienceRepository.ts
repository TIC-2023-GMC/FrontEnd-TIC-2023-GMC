import {
	ExperienceFilter,
	Publication,
	PublicationScreen
} from '../../domain/models/InterfacesModels';
import { IPublicationRepository } from '../../domain/repositories/IPublicationRepository';
import { get, post } from '../services/api';
import { getAddExperienceEndpoint, getListExperiencesEnpoint } from '../services/endpoints';
export class AxiosExperienceRepository implements IPublicationRepository {
	create(_publication: Publication): Promise<void> {
		return post(getAddExperienceEndpoint(), _publication);
	}
	async find(
		_pageParam: number,
		_pageSize: number,
		_filter: ExperienceFilter
	): Promise<PublicationScreen> {
		const newDate = _filter?.date ? new Date(_filter?.date) : undefined;
		const response = await get<PublicationScreen>(
			getListExperiencesEnpoint({
				pageParam: _pageParam,
				pageSize: _pageSize,
				filter: _filter,
				newDate: newDate
			})
		);
		return response.data;
	}
}
