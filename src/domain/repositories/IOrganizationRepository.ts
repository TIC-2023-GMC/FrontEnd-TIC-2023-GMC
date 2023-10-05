/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrganizationResults } from '../models/InterfacesModels';

export interface IOrganizationRepository {
	find(_pageParam: number, _pageSize: number): Promise<OrganizationResults | any>;
}
