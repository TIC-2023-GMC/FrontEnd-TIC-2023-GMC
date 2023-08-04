import { Text, StyleSheet } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import React from 'react';

interface CardGameSeleccionProps {
	title: string;
	image: string;
	onPress: () => void;
}
const theme = useTheme();
export default function GameOptionCard({ title, image, onPress }: CardGameSeleccionProps) {
	return (
		<Card style={styles.container}>
			<Card.Cover source={{ uri: image }} style={styles.image} />
			<Text>{title}</Text>
			<Button onPress={onPress} style={styles.button}>
				Jugar
			</Button>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#4CAF50',
		padding: 8
	},
	image: {
		width: 133,
		height: 134,
		borderRadius: 10
	},
	button: {
		backgroundColor: theme.colors.primary,
		borderRadius: 10,
		width: 150,
		height: 40
	}
});
