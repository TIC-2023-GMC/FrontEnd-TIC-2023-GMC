import { PublicationScreen, User } from '../../domain/models/InterfacesModels';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { get, put } from '../services/api';
import {
	getMyPublicationsEndpoint,
	getUpdateUserEndpoint,
	getUserByIdEndpoint
} from '../services/endpoints';
export class AxiosUserRepository implements IUserRepository {
	async findMyPublications(
		_id: string,
		_pageParam: number,
		_pageSize: number
	): Promise<PublicationScreen> {
		const response = await get<PublicationScreen>(
			getMyPublicationsEndpoint({ pageParam: _pageParam, pageSize: _pageSize, user_id: _id })
		);

		return response.data;
	}
	create(_user: User): Promise<User> {
		throw new Error('Method not implemented.');
	}
	async findById(_id: string): Promise<User> {
		const response = await get<User>(getUserByIdEndpoint(_id ?? ''));
		return response.data;
	}
	findByEmail(_email: string): Promise<User> {
		throw new Error('Method not implemented.');
	}
	find(): Promise<User[]> {
		throw new Error('Method not implemented.');
	}
	async update(_user: User): Promise<User> {
		const response = await put(getUpdateUserEndpoint(), _user);
		return response.data;
	}
	delete(_id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
