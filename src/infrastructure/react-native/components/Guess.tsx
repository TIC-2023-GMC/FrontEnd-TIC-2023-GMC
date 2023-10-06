import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { Button, MD3Theme, useTheme } from 'react-native-paper';
interface GuessProps {
	word: string;
	guess: string;
	isGuessed: boolean;
}
export default function Guess({ word, guess, isGuessed }: GuessProps) {
	const theme = useTheme();
	const width = (100 / word.length).toString() + '%';
	const styles = useStyles(theme, width);
	console.log(word);
	guess = guess.toUpperCase();
	word = word.toUpperCase();

	return (
		<View style={styles.container}>
			{word.split('').map((letter, index) => {
				const bgColor = !isGuessed
					? theme.colors.onSurface
					: letter === guess[index]
					? theme.colors.primary
					: word.includes(guess[index])
					? theme.colors.tertiary
					: theme.colors.onSurface;

				return (
					<Button
						style={styles.button}
						buttonColor={bgColor}
						labelStyle={styles.letter}
						key={index}
					>
						{guess[index]}
					</Button>
				);
			})}
		</View>
	);
}

const useStyles = (theme: MD3Theme, width: string) => {
	const fontSize = parseFloat(width) * 0.9;

	return StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
		letter: {
			fontSize: fontSize,
			fontWeight: 'bold',
			color: theme.colors.secondary,
			textAlign: 'center'
		},
		button: {
			width: width as DimensionValue,
			marginHorizontal: 0,
			marginVertical: 0,
			padding: 15,
			borderWidth: 1,
			borderColor: 'white',
			borderRadius: 0
		}
	});
};
