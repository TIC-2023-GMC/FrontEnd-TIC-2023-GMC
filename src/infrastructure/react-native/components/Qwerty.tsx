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
			<View style={styles.options}>
				<IconButton icon="delete" onPress={() => store.clearGuess()} iconColor={theme.colors.secondary} rippleColor={"red"} />
				<IconButton icon="backspace" onPress={() => store.clearLastLetter()} iconColor={theme.colors.secondary} rippleColor={"#B59F3B"} />
				<Button
					onPress={() => store.submitGuess()}
					labelStyle={styles.label}
					mode='contained'
				>
					Enviar
				</Button>
			</View>
			{qwerty.map((row, i) => (
				<View key={i} style={styles.row}>
					{row.split('').map((letter, j) => {
						const bgColor = store.exactGuesses.includes(letter)
							? theme.colors.primary
							: store.inexactGuesses.includes(letter)
								? "#B59F3B"
								: store.allGuesses.includes(letter)
									? theme.colors.tertiary
									: theme.colors.tertiary;
						return (
							<Button
								style={styles.button}
								labelStyle={styles.label}
								key={i + j}
								buttonColor={bgColor}
								rippleColor={theme.colors.secondary}
								textColor={theme.colors.secondary}
								onPress={() => store.handlerKeyup(letter)}
							>
								{letter}
							</Button>
						);
					})}
				</View>
			))}
		</View>
	);
});
const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
		marginTop: "auto",
		backgroundColor: "#797979",
		padding: 5,
		paddingTop: 10,
		paddingBottom: "10%",
		borderRadius: 10,
	},
	options: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginTop: 5
	},
	row: {
		alignSelf: "stretch",
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: 5,
	},
	button: {
		minWidth: 20,
		minHeight: 40,
		margin: 2,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		color: "#fff",
		fontWeight: "bold",
		textTransform: 'uppercase',
	}
});
