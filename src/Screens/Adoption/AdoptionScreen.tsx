import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import PublicationCard from '../../components/PublicationCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface HelloAdoption {
	message: string;
}
export function AdoptionScreen() {
	const theme = useTheme();
	const ref = useRef<ScrollView>(null);
	const tabBarHeight = useBottomTabBarHeight();
	useScrollToTop(ref);
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
			<ActivityIndicator animating={true} size="large" />
			<Text style={{ marginTop: 10 }}>Cargando</Text>
		</View>
	) : (
		<ScrollView style={{ ...styles.section, marginBottom: tabBarHeight ,backgroundColor: theme.colors.secondary }} ref={ref}>
			<StatusBar style="auto" />
			<PublicationCard />
			<PublicationCard />
			<Text>AdoptionScreen by</Text>
			<Text>{message?.message}</Text>
		</ScrollView>
	);
}
