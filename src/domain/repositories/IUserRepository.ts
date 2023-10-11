/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	LoginCredentials,
	PublicationScreen,
	Token,
	User,
	UserRegisterResult
} from '../../domain/models/InterfacesModels';

export interface IUserRepository {
	create(_user: User): Promise<UserRegisterResult | any>;
	findById(_id: string): Promise<User | any>;
	findByEmail(_email: string): Promise<User | any>;
	findByToken(): Promise<User | any>;
	find(_credentials: LoginCredentials): Promise<Token | any>;
	findMyPublications(
		_id: string,
		_pageParam: number,
		_pageSize: number
	): Promise<PublicationScreen | any>;
	update(_user: User): Promise<User | any>;
	delete(_id: string): Promise<void>;
	configAuth(_token: Token): void;
}
