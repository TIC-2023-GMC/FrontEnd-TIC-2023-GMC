import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, MD3Theme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { TabsNavigation } from './src/navigation/MainNavigator';
import { AuthProvider } from './src/auth/userContext';

export default function App() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<AuthProvider>
				<PaperProvider theme={theme}>
					<NavigationContainer>
						<TabsNavigation />
					</NavigationContainer>
				</PaperProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

const theme: MD3Theme = {
	...DefaultTheme, // Importa el tema predeterminado de react-native-paper y modifícalo según tus necesidades
	colors: {
		...DefaultTheme.colors,
		// Mantén los colores predeterminados y modifícalos si es necesario
		primary: '#7A8A50',
		secondary: '#ECEBEB',
		tertiary: '#A3A3A3',
		inverseSurface: 'rgba(163, 163, 163, 1)',
		inversePrimary: '#ECEBEB'
	}

	// Agrega cualquier otra configuración de tema que desees
};
