import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { User } from '../models/InterfacesModels';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdEndpoint } from '../services/endpoints';
import { get } from '../services/api';
import { ActivityIndicator } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export interface UserContextParams {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
}
export const UserContext = createContext<UserContextParams>({} as UserContextParams);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { data } = useQuery({
		queryKey: ['userProfileData'],
		queryFn: async () => {
			const response = await get<User>(getUserByIdEndpoint('64c1b0ef0fd89c04b7114eb7'));
			return response.data;
		}
	});
	const [user, setUser] = useState<User>({} as User);
	useEffect(() => {
		if (data) {
			const user: User = {
				...data,
				birth_date: new Date(data?.birth_date)
			};
			setUser(user);
		}
	}, [data]);
	return data ? (
		<UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
	) : (
		<ActivityIndicator animating={true} size={'large'} style={styles.activityIndicator} />
	);
};

const styles = StyleSheet.create({
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
