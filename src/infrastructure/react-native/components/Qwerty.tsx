import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import { IWordleGameStoreService } from '../../../domain/repositories/IWordleGameStoreService';
export default observer(function Qwerty({ store }: { store: IWordleGameStoreService }) {
	const qwerty = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
	const theme = useTheme();

	return (
		<View style={styles.container}>
			{qwerty.map((row, i) => (
				<View key={i} style={styles.row}>
					{row.split('').map((letter, j) => {
						const bgColor = store.exactGuesses.includes(letter)
							? theme.colors.primary
							: store.inexactGuesses.includes(letter)
							? theme.colors.tertiary
							: store.allGuesses.includes(letter)
							? theme.colors.secondary
							: theme.colors.onSurface;
						return (
							<Button
								style={styles.button}
								labelStyle={styles.label}
								key={i + j}
								buttonColor={bgColor}
								textColor={theme.colors.secondary}
								onPress={() => store.handlerKeyup(letter)}
							>
								{letter}
							</Button>
						);
					})}
				</View>
			))}
			<View style={styles.row}>
				<Button onPress={() => store.submitGuess()}>Enviar</Button>
				<IconButton icon="backspace" onPress={() => store.clearLastLetter()} />
				<IconButton icon="delete" onPress={() => store.clearGuess()} />
			</View>
		</View>
	);
});
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '98%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginTop: 5
	},
	button: {
		minWidth: 35,
		minHeight: 40,
		borderRadius: 10,
		marginHorizontal: 0.5
	},
	label: {
		fontSize: 20,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		textAlign: 'center',
		marginHorizontal: 0
	}
});
