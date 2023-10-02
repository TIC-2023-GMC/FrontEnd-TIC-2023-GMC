// import { useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
// import { get } from '../../infrastructure/services/api';
// import { getParishEndpoint } from '../../infrastructure/services/endpoints';

import { inject, injectable } from 'tsyringe';
import { IParishRepository } from '../../domain/repositories/IParishRepository';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// // eslint-disable-next-line no-unused-vars
// export function useParish() {
// 	const [itemsLocation, setItemsLocation] = useState<Location[]>([]);

// 	const { isLoading } = useQuery({
// 		queryKey: ['location'],
// 		queryFn: async () => {
// 			const response = await get<Location[]>(getParishEndpoint());
// 			return response.data;
// 		},
// 		onSuccess: (data) => {
// 			setItemsLocation(data);
// 		}
// 	});

// 	return { isLoading, itemsLocation, setItemsLocation };
// }

@injectable()
export class GetParishUseCase {
	constructor(@inject('LocationRepository') private _repository: IParishRepository) {}
	useQueryParish() {
		const [itemsLocation, setItemsLocation] = useState<Location[]>([]);
		const { isLoading } = useQuery({
			queryKey: ['location'],
			queryFn: async () => {
				const response = await this._repository.find();
				return response;
			},
			onSuccess: (data) => {
				setItemsLocation(data);
			}
		});
		return { isLoading, itemsLocation, setItemsLocation };
	}
}
