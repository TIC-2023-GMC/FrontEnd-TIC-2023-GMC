import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { inject, injectable } from 'tsyringe';
import {
	AdoptionFilter,
	ExperienceFilter,
	Publication
} from '../../domain/models/InterfacesModels';
import { IPublicationRepository } from '../../domain/repositories/IPublicationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class ListAdoptionsUseCase {
	constructor(@inject('AdoptionRepository') private repository: IPublicationRepository) {
		this.repository = repository;
	}
	useQueryAdoption(filter: AdoptionFilter, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Adoption'],
			queryFn: async ({ pageParam = 1 }) => {
				return this.repository.find(pageParam, pageSize, filter);
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
	constructor(@inject('AdoptionRepository') private repository: IPublicationRepository) {
		this.repository = repository;
	}
	useMutationAdoptionPublication(reset: () => void) {
		const [loading, setLoading] = useState<boolean>(false);
		const createPublicationMutation = useMutation({
			mutationFn: (data: Publication) =>
				this.repository.create(data).then((response) => response.data),
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
	constructor(@inject('ExperienceRepository') private repository: IPublicationRepository) {
		this.repository = repository;
	}
	useQueryExperience(filter: ExperienceFilter, pageSize: number) {
		return useInfiniteQuery({
			queryKey: ['Experience'],
			queryFn: async ({ pageParam = 1 }) => {
				return this.repository.find(pageParam, pageSize, filter);
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
	constructor(@inject('ExperienceRepository') private repository: IPublicationRepository) {
		this.repository = repository;
	}
	useMutationExperiencePublication(reset: () => void) {
		const [loading, setLoading] = useState<boolean>(false);

		const createPublicationMutation = useMutation({
			mutationFn: (data: Publication) =>
				this.repository.create(data).then((response) => response.data),
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
	constructor(@inject('UserRepository') private repository: IUserRepository) {
		this.repository = repository;
	}
	userQueryMyPublications(pageSize: number, userId: string) {
		return useInfiniteQuery({
			queryKey: ['MyPublications'],
			queryFn: async ({ pageParam = 1 }) => {
				return this.repository.findMyPublications(userId, pageParam, pageSize);
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
