import { useQueryClient } from '@tanstack/react-query';
import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext } from '../../../application/auth/user.auth';
import {
	ConfigAuthUseCase,
	GetAuthUserUseCase,
	LogoutUserUseCase
} from '../../../application/hooks';
import { User } from '../../../domain/models/InterfacesModels';
import AuthNavigator from '../navigation/AuthNavigator';
const logout = container.resolve(LogoutUserUseCase);
const getUserByToken = container.resolve(GetAuthUserUseCase);
const configAuth = container.resolve(ConfigAuthUseCase);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [initializing, setInitializing] = useState(true);
	const { data, isLoading, isError, refetch, isSuccess } = getUserByToken.useQueryAuthUser();
	const [error, setError] = useState<string>('');
	const [user, setUser] = useState<User>({} as User);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data && Object.keys(data).length !== 0 && isSuccess) {
			const user: User = {
				...data,
				birth_date: new Date(data?.birth_date)
			};
			setUser(user);
			setInitializing(false);
		}
		if (isError) {
			setError('La sesión ha expirado, por favor inicie sesión nuevamente.');
			setInitializing(false);
		}
	}, [data, isError, isSuccess]);


	useEffect(() => {
		configAuth.config().catch((err) => {
			console.log(err);
		});
	}, []);

	return isLoading || initializing ? (
		<ActivityIndicator animating={true} size={'large'} style={styles.activityIndicator} />
	) : user && Object.keys(user).length !== 0 ? (
		<UserContext.Provider
			value={{
				user: user,
				setUser: setUser,
				logOut: () => {
					logout.logoutUser(setUser, queryClient);
				}
			}}
		>
			{children}
		</UserContext.Provider>
	) : (
		<AuthNavigator
			error={error}
			setError={setError}
			loginUser={() => {
				refetch();
			}}
		/>
	);
};

const styles = StyleSheet.create({
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
