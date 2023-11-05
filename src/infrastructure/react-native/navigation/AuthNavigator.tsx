import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { LoginScreenForm } from '../Screens/User/LoginScreenForm';
import { RegisterScreenForm } from '../Screens/User/RegisterScreenForm';

const AuthStack = createNativeStackNavigator();

const AuthNavigator = ({
	error,
	setError,
	loginUser
}: {
	error: string;
	setError: React.Dispatch<React.SetStateAction<string>>;
	loginUser: () => void;
}) => {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Login">
				{(props) => (
					<LoginScreenForm {...props} setError={setError} error={error} loginUser={loginUser} />
				)}
			</AuthStack.Screen>
			<AuthStack.Screen name="Register">
				{(props) => (
					<RegisterScreenForm {...props} setError={setError} error={error} loginUser={loginUser} />
				)}
			</AuthStack.Screen>
		</AuthStack.Navigator>
	);
};

export default AuthNavigator;
