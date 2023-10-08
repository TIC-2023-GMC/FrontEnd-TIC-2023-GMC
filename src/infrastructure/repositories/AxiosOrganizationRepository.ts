import { Organization } from '../../domain/models/InterfacesModels';
import { IOrganizationRepository } from '../../domain/repositories/IOrganizationRepository';
import { get } from '../services/api';
import { getListOrganizationsEndpoint } from '../services/endpoints';

export class AxiosOrganizationRepository implements IOrganizationRepository {
	async find(_pageParam: number, _pageSize: number): Promise<Organization> {
		const response = await get<Organization>(
			getListOrganizationsEndpoint({ pageParam: _pageParam, pageSize: _pageSize })
		);
		return response.data;
	}
}
