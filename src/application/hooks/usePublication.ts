import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import { GetStoragedTokenUseCase } from './useUser';
import {
	AdoptionFilter,
	ExperienceFilter,
	Publication,
	Token
} from '../../domain/models/InterfacesModels';
import { IPhotoRepository } from '../../domain/repositories/IPhotoRepository';
import { IPublicationRepository } from '../../domain/repositories/IPublicationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class ListAdoptionsUseCase {
	constructor(@inject('AdoptionRepository') private _repository: IPublicationRepository) {}
	useQueryAdoption(filter: AdoptionFilter, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Adoption'],
			queryFn: async ({ pageParam = 1 }) => {
				return this._repository.find(pageParam, pageSize, filter);
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			}
		});
	}
}
@injectable()
export class CreateAdoptionUseCase {
	constructor(@inject('AdoptionRepository') private _repository: IPublicationRepository) {}
	useMutationAdoptionPublication(reset: () => void) {
		const [loading, setLoading] = useState<boolean>(false);
		const createPublicationMutation = useMutation({
			mutationFn: (data: Publication) =>
				this._repository.create(data).then((response) => response.data),
			onSuccess: () => {
				setLoading(false);
				reset();
			}
		});
		return { loading, createPublicationMutation, setLoading };
	}
}

@injectable()
export class ListExperiencesUseCase {
	constructor(@inject('ExperienceRepository') private _repository: IPublicationRepository) {}
	useQueryExperience(filter: ExperienceFilter, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Experience'],
			queryFn: async ({ pageParam = 1 }) => {
				return this._repository.find(pageParam, pageSize, filter);
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			}
		});
	}
}

@injectable()
export class CreateExperienceUseCase {
	constructor(@inject('ExperienceRepository') private _repository: IPublicationRepository) {}
	useMutationExperiencePublication(reset: () => void) {
		const [loading, setLoading] = useState<boolean>(false);

		const createPublicationMutation = useMutation({
			mutationFn: (data: Publication) =>
				this._repository.create(data).then((response) => response.data),
			onSuccess: () => {
				setLoading(false);
				reset();
			}
		});
		return { loading, createPublicationMutation, setLoading };
	}
}
@injectable()
export class ListMyPublicationUseCase {
	constructor(@inject('UserRepository') private _repository: IUserRepository) {}
	userQueryMyPublications(pageSize: number, userId: string) {
		return useInfiniteQuery({
			queryKey: ['MyPublications'],
			queryFn: async ({ pageParam = 1 }) => {
				return this._repository.findMyPublications(userId, pageParam, pageSize);
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			},
			refetchOnWindowFocus: true,
			refetchIntervalInBackground: true,
			refetchOnMount: 'always'
		});
	}
}

@injectable()
export class UploadImageUseCase {
	constructor(
		@inject('PhotoRepository') private _repository: IPhotoRepository,
		@inject('GetStoragedToken') private _getTokenUseCase: GetStoragedTokenUseCase
	) {}
	async uploadImage(uri: string, setError: React.Dispatch<React.SetStateAction<string>>) {
		try {
			const token = await this._getTokenUseCase.getTokenUser();
			const tokenObject: Token = JSON.parse(token ?? '{}');
			return await this._repository.create(uri, tokenObject);
		} catch (error) {
			console.log(error);
			setError('Error al subir la imagen');
		}
	}
}
