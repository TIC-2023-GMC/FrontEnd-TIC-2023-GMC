import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';

interface HelloAdoption {
	message: string;
}
export function AdoptionScreen() {
	const theme = useTheme();
	const [message, setMessage] = useState<HelloAdoption>();
	const { isFetching } = useQuery({
		queryKey: ['HelloAdoption'],
		enabled: true,
		queryFn: () => get<HelloAdoption>('/test'),
		onSuccess: (response) => {
			setMessage(response.data);
		}
	});
	return isFetching ? (
		<View style={styles.container}>
			<ActivityIndicator
				animating={true}
				color={theme.colors.primary}
				size="large"
			></ActivityIndicator>
		</View>
	) : (
		<View style={styles.container}>
			<Text>AdoptionScreen by</Text>
			<Text>{message?.message}</Text>
			<StatusBar style="auto" />
		</View>
	);
}
