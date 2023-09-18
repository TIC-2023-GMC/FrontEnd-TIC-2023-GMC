import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { User } from '../models/InterfacesModels';
import { get, put } from '../services/api';
import { getUpdateUserEndpoint, getUserByIdEndpoint } from '../services/endpoints';

export function useMutationUser(resetForm: () => void) {
	const [loading, setLoading] = useState(false);
	const updateUserMutation = useMutation({
		mutationFn: (data: User) =>
			put(getUpdateUserEndpoint(), data).then((response) => response.data),
		onSuccess: () => {
			setLoading(false);
			resetForm();
		}
	});
	return { updateUserMutation, loading, setLoading };
}

export function useQueryUser(userId: string | undefined) {
	return useQuery({
		queryKey: ['userProfileData'],
		queryFn: async () => {
			const response = await get<User>(getUserByIdEndpoint(userId ?? ''));
			return response.data;
		},
		enabled: !!userId
	});
}
