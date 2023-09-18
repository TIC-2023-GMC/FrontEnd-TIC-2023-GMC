import { useQuery } from '@tanstack/react-query';
import { getParishEndpoint } from '../services/endpoints';
import { get } from '../services/api';
import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
export function useParish() {
	const [itemsLocation, setItemsLocation] = useState<Location[]>([]);

	const { isLoading } = useQuery({
		queryKey: ['location'],
		queryFn: async () => {
			const response = await get<Location[]>(getParishEndpoint());
			return response.data;
		},
		onSuccess: (data) => {
			setItemsLocation(data);
		}
	});

	return { isLoading, itemsLocation, setItemsLocation };
}
