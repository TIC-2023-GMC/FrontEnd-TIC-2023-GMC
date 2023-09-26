import axios from 'axios';
import {
	LoginCredentials,
	PublicationScreen,
	Token,
	User
} from '../../domain/models/InterfacesModels';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { get, post, put } from '../services/api';
import {
	getLoginEndpoint,
	getMyPublicationsEndpoint,
	getUpdateUserEndpoint,
	getUserByIdEndpoint,
	getUserMeEndpoint
} from '../services/endpoints';
export class AxiosUserRepository implements IUserRepository {
	find = async (_credentials: LoginCredentials): Promise<Token> => {
		const dataLogin = {
			username: _credentials.email,
			password: _credentials.password
		};
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};
		const formData = new URLSearchParams(dataLogin).toString();
		const response = await post<Token>(getLoginEndpoint(), formData, config);

		if (response.data.access_token) this.configAxiosAuth(response.data);
		return response.data;
	};
	async findByToken(_token: Token): Promise<User> {
		this.configAxiosAuth(_token);
		const response = await get<User>(getUserMeEndpoint());
		return response.data;
	}
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

	async update(_user: User): Promise<User> {
		const response = await put(getUpdateUserEndpoint(), _user);
		return response.data;
	}
	delete(_id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	configAxiosAuth(token: Token) {
		axios.interceptors.request.use((request) => {
			request.headers.Authorization = `${token.token_type} ${token.access_token}`;
			return request;
		});
	}
}
