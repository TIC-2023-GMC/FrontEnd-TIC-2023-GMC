import { AxiosResponse } from 'axios';
import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/InterfacesModels';
import { get, put } from '../services/api';
import { getUpdateUserEndpoint, getUserByIdEndpoint } from '../services/endpoints';
@injectable()
export class AxiosRepository implements IUserRepository {
	create(_user: User): Promise<User> {
		throw new Error('Method not implemented.');
	}
	async findById(_id: string): Promise<AxiosResponse<User>> {
		const response = await get<AxiosResponse<User>>(getUserByIdEndpoint(_id ?? ''));
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
