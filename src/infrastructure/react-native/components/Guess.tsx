import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
interface GuessProps {
	word: string;
	guess: string;
	isGuessed: boolean;
}
export default function Guess({ word, guess, isGuessed }: GuessProps) {
	const theme = useTheme();
	const styles = style
	guess = guess.toUpperCase();
	word = word.toUpperCase();

	const defineSize = (length: number) => {
		return length > 6 ? 16 : 30
	}
	return (
		<View style={styles.container}>
			{word.split('').map((letter, index) => {
				const bgColor = !isGuessed
					? theme.colors.tertiary
					: letter === guess[index]
						? theme.colors.primary
						: word.includes(guess[index])
							? "#B59F3B"
							: theme.colors.tertiary;
				return (
					<View style={{
						...styles.cell, backgroundColor: bgColor,
					}}>
						<Text
							style={[{
								...styles.cellText,
								fontSize: defineSize(word.length),
								color: theme.colors.secondary
							}]}>{guess[index]}
						</Text>
					</View>
				);
			})}
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	row: {
		alignSelf: 'stretch',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	cell: {
		maxWidth: 70,
		height: 30,
		flex: 1,
		borderWidth: 2,
		borderRadius: 5,
		aspectRatio: 1,
		margin: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cellText: {
		fontWeight: 'bold',
	}
});