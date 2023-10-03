/* eslint-disable @typescript-eslint/no-explicit-any */
import { Organization } from '../models/InterfacesModels';

export interface IOrganizationRepository {
	find(_pageParam: number, _pageSize: number): Promise<Organization|any>;
}
