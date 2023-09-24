import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
	AdoptionFilter,
	AdoptionPublication,
	ExperienceFilter,
	ExperiencePublication
} from '../../domain/models/InterfacesModels';
import { get, post } from '../../infrastructure/services/api';
import {
	getAddAdoptionEndpoint,
	getAddExperienceEndpoint,
	getListAdoptionsEndpoint,
	getListExperiencesEnpoint,
	getMyPublicationsEndpoint
} from '../../infrastructure/services/endpoints';

interface AdoptionPublicationScreen {
	0: AdoptionPublication[];
	1: number;
}
interface ExperiencePublicationScreen {
	0: ExperiencePublication[];
	1: number;
}
export function useQueryAdoption(filter: AdoptionFilter, pageSize: number) {
	return useInfiniteQuery({
		queryKey: ['Adoption'],
		queryFn: async ({ pageParam = 1 }) => {
			const newDate = filter?.date ? new Date(filter?.date) : undefined;
			const response = await get<AdoptionPublicationScreen>(
				getListAdoptionsEndpoint({ pageParam, filter, pageSize, newDate })
			);
			return response.data;
		},
		getNextPageParam: (lastPage) => {
			if (lastPage[0].length !== 0) {
				return lastPage[1];
			}
			return undefined;
		}
	});
}

export function useMutationAdoptionPublication(reset: () => void) {
	const [loading, setLoading] = useState<boolean>(false);

	const createPublicationMutation = useMutation({
		mutationFn: (data: AdoptionPublication) =>
			post(getAddAdoptionEndpoint(), data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			reset();
		}
	});

	return { loading, createPublicationMutation, setLoading };
}

export function useQueryExperience(filter: ExperienceFilter, pageSize: number) {
	return useInfiniteQuery({
		queryKey: ['Experience'],
		queryFn: async ({ pageParam = 1 }) => {
			const newDate = filter?.date ? new Date(filter?.date) : undefined;
			const response = await get<ExperiencePublicationScreen>(
				getListExperiencesEnpoint({ pageParam, pageSize, filter, newDate })
			);
			return response.data;
		},
		getNextPageParam: (lastPage) => {
			if (lastPage[0].length !== 0) {
				return lastPage[1];
			}
			return undefined;
		}
	});
}

export function useMutationExperiencePublication(reset: () => void) {
	const [loading, setLoading] = useState<boolean>(false);

	const createPublicationMutation = useMutation({
		mutationFn: (data: ExperiencePublication) =>
			post(getAddExperienceEndpoint(), data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			reset();
		}
	});
	return { loading, createPublicationMutation, setLoading };
}

export function userQueryMyPublications(pageSize: number, userId: string) {
	return useInfiniteQuery({
		queryKey: ['MyPublications'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await get<AdoptionPublicationScreen>(
				getMyPublicationsEndpoint({ pageParam, pageSize, user_id: userId })
			);

			return response.data;
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
