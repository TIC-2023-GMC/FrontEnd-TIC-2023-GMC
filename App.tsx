import './src/ic/ic';
import './src/infrastructure/services/api';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es-EC.json';
import React from 'react';
import { DefaultTheme, MD3Theme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/infrastructure/react-native/auth-provider/AuthProvider';

TimeAgo.addDefaultLocale(es);
export default function App() {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<PaperProvider theme={theme}>
				<SafeAreaProvider>
					<NavigationContainer>
						<AuthProvider />
					</NavigationContainer>
				</SafeAreaProvider>
			</PaperProvider>
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
		inverseSurface: '#7A8A50',
		inversePrimary: '#ECEBEB',
		onSurfaceVariant: '#A3A3A3',
		surfaceVariant: '#ECEBEB'
	}

	// Agrega cualquier otra configuración de tema que desees
};
