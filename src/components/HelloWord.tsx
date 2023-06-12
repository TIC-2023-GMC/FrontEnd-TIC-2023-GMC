import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { get } from '../services/api';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

interface HelloWord {
	message: string;
}

export default function HelloWord() {
	const [message, setMessage] = useState<HelloWord>();
	const { isFetching } = useQuery({
		queryKey: ['HelloWord'],
		enabled: true,
		queryFn: () => get<HelloWord>('/test/'),
		onSuccess: (response) => {
			setMessage(response.data);
		}
	});

	return (
		<View style={styles.container}>
			<Text>{message?.message}</Text>
			<StatusBar style="auto" />
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
