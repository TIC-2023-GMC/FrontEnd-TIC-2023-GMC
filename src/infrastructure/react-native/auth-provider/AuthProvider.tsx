import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
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
import { ExpireToken } from '../../../utils/utils';
import AuthNavigator from '../navigation/AuthNavigator';
import { GameNavigationStack } from '../navigation/GameNavigator';
import { TabsNavigation } from '../navigation/SocialNavigator';
const logout = container.resolve(LogoutUserUseCase);
const getUserByToken = container.resolve(GetAuthUserUseCase);
const configAuth = container.resolve(ConfigAuthUseCase);

export const AuthProvider = () => {
	const [socialActive, setSocialActive] = useState<boolean>(true);
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
		ExpireToken(() => logout.logoutUser(setUser, queryClient));
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
			{socialActive ? (
				<TabsNavigation visible={socialActive} setVisible={setSocialActive} />
			) : (
				<GameNavigationStack visible={socialActive} setVisible={setSocialActive} />
			)}
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
