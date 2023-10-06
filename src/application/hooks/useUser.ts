import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import { Token, User } from '../../domain/models/InterfacesModels';
import { IInternalStoreRepository } from '../../domain/repositories/IInternalStoreRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
@injectable()
export class UpdateUserUseCase {
	constructor(@inject('UserRepository') private _userRepository: IUserRepository) {}
	useMutationUser(resetForm: () => void) {
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState(false);
		const resetError = () => setError(false);
		const updateUserMutation = useMutation({
			mutationFn: this._userRepository?.update,
			onSuccess: () => {
				setLoading(false);
				resetForm();
			},
			onError: () => {
				setLoading(false);
				setError(true);
			}
		});
		return { updateUserMutation, loading, setLoading, error, resetError };
	}
}
@injectable()
export class GetUserUseCase {
	constructor(@inject('UserRepository') private _userRepository: IUserRepository) {}

	useQueryUser(userId: string | undefined) {
		return useQuery({
			queryKey: ['userProfileData', userId],
			queryFn: () => this._userRepository.findById(userId ?? ''),
			enabled: !!userId
		});
	}
}

@injectable()
export class GetAuthUserUseCase {
	constructor(@inject('UserRepository') private _userRepository: IUserRepository) {}

	useQueryAuthUser() {
		return useQuery({
			queryKey: ['UserAuth'],
			queryFn: async () => {
				return this._userRepository.findByToken();
			},
			staleTime: 1000 * 60 * 30
		});
	}
}
@injectable()
export class ConfigAuthUseCase {
	constructor(
		@inject('UserRepository') private _userRepository: IUserRepository,
		@inject('GetStoragedToken') private _getTokenUseCase: GetStoragedTokenUseCase
	) {}

	async config() {
		const token = await this._getTokenUseCase.getTokenUser();
		if (!token) {
			throw new Error('No se encontró un token de usuario.');
		}

		const tokenObject: Token = JSON.parse(token);
		this._userRepository.configAuth(tokenObject);
	}
}

@injectable()
export class GetStoragedTokenUseCase {
	constructor(
		@inject('InternalStoreRepository') private _internalStoreRepository: IInternalStoreRepository
	) {}
	async getTokenUser() {
		const token = await this._internalStoreRepository.get('userToken');
		return token;
	}
}
@injectable()
export class SetTokenInStorageUseCase {
	constructor(
		@inject('InternalStoreRepository') private _internalStoreRepository: IInternalStoreRepository
	) {}
	async setTokenInStorage(token: Token) {
		await this._internalStoreRepository.set('userToken', token);
	}
}
@injectable()
export class LogoutUserUseCase {
	constructor(
		@inject('InternalStoreRepository') private _internalStoreRepository: IInternalStoreRepository
	) {}
	logoutUser(setUser: React.Dispatch<React.SetStateAction<User>>, queryClient: QueryClient) {
		setUser({} as User);
		this._internalStoreRepository.remove('userToken');

		queryClient.setQueryData(['UserAuth'], () => {
			return {} as User;
		});
	}
}

@injectable()
export class LoginUserUseCase {
	constructor(
		@inject('SetTokenInStorage') private _setTokenInStorageUseCase: SetTokenInStorageUseCase,
		@inject('UserRepository') private _userRepository: IUserRepository
	) {}
	loginUser(loginUser: () => void) {
		const [loading, setLoading] = useState(false);
		const userLoginMutation = useMutation({
			mutationFn: this._userRepository?.find,
			onSuccess: async (data: Token) => {
				await this.setAuthUser(data);
				this._userRepository.configAuth(data);
				setLoading(false);
				loginUser();
			},
			onError: () => {
				setLoading(false);
			}
		});
		return { userLoginMutation, loading, setLoading };
	}

	async setAuthUser(token: Token) {
		await this._setTokenInStorageUseCase.setTokenInStorage(token);
	}
}
