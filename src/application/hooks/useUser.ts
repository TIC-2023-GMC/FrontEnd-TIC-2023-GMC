import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
@injectable()
export class UpdateUserUseCase {
	constructor(@inject('UserRepository') private _userRepository: IUserRepository) {
		this._userRepository = _userRepository;
	}
	useMutationUser(resetForm: () => void) {
		const [loading, setLoading] = useState(false);
		const updateUserMutation = useMutation({
			mutationFn: this._userRepository?.update,
			onSuccess: () => {
				setLoading(false);
				resetForm();
			}
		});
		return { updateUserMutation, loading, setLoading };
	}
}
@injectable()
export class GetUserUseCase {
	constructor(@inject('UserRepository') private _userRepository: IUserRepository) {
		this._userRepository = _userRepository;
	}

	useQueryUser(userId: string | undefined) {
		return useQuery({
			queryKey: ['userProfileData'],
			queryFn: () => this._userRepository?.findById(userId ?? ''),
			enabled: !!userId
		});
	}
}
