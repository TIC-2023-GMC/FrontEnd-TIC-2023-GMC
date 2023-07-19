import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { TabsNavigation } from './src/navigation/MainNavigator';

export default function App() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<PaperProvider theme={theme}>
				<NavigationContainer>
					<TabsNavigation></TabsNavigation>
					{/* <HelloWord></HelloWord> */}
				</NavigationContainer>
			</PaperProvider>
		</QueryClientProvider>
	);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const theme: any = {
	...DefaultTheme, // Importa el tema predeterminado de react-native-paper y modifícalo según tus necesidades
	colors: {
		...DefaultTheme.colors, // Mantén los colores predeterminados y modifícalos si es necesario
		primary: '#7A8A50', // Define tu color primario
		secondary: '#ECEBEB', // Define tu color de acento
		tertiary: '#A3A3A3'
	}

	// Agrega cualquier otra configuración de tema que desees
};
