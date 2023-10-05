import { IParishRepository } from '../../domain/repositories/IParishRepository';
import { get } from '../services/api';
import { getParishEndpoint } from '../services/endpoints';

export class AxiosParishRepository implements IParishRepository {
	find = async (): Promise<Location[]> => {
		const response = await get<Location[]>(getParishEndpoint());
		return response.data;
	};
}
