import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Button,
	Modal,
	Portal,
	Text,
	useTheme,
	ActivityIndicator,
	IconButton
} from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../../application/auth/user.auth';
import Guess from '../../../components/Guess';
import Querty from '../../../components/Qwerty';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
	GetWordleGameStoreUseCase,
	GetWordleWordsUseCase,
	sendScoreWordleGameUsecase
} from '../../../../../application/hooks/UseWordleGame';
const getStore = container.resolve(GetWordleGameStoreUseCase);
const getUseQuery = container.resolve(GetWordleWordsUseCase);
const sendScore = container.resolve(sendScoreWordleGameUsecase);
export default observer(function WordleGameScreen() {
	const store = getStore.useWordleGameStore();
	const [visibleModal, setVisibleModal] = useState(true);
	const [initVisibleModal, setInitVisibleModal] = useState(true);
	const navigation = useNavigation();
	const { user } = useContext<UserContextParams>(UserContext);
	const { loading, wordle } = getUseQuery.useQueryWordleWords();
	const theme = useTheme();
	const { sendScoreWordleGame } = sendScore.useMutationSendScoreWordleGame();

	useEffect(() => {
		if (wordle && wordle.wordle_game_words && wordle.wordle_game_words.length > 0) {
			store.init(wordle.wordle_game_words);
		}
	}, [wordle]);

	const attempts = store.attempts;
	const style = styles;
	//llevar a la pantalla de final
	useEffect(() => {
		if (store.won || store.lost) {
			sendScoreWordleGame.mutate({
				...wordle,
				match_game_score: store.score
			});
		}
	}, [store.won, store.lost]);
	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
				<Text variant="headlineMedium">Adivina la Palabra</Text>
				<View style={style.clue}>
					<IconButton
						icon={'lightbulb'}
						size={25}
						iconColor="#B59F3B"
						style={{ margin: 0, padding: 0 }}
					/>
					<Text>
						Pista: La multa de este tipo de infracciones es del 30% del salario mínimo, no olvides
						qye tienes que pagar la multa pronto
					</Text>
				</View>
				<View style={style.gameInformation}>
					<View style={style.itemInformation}>
						<IconButton icon={'gamepad'} size={25} iconColor={theme.colors.primary} />
						<Text>Intentos: {attempts}</Text>
					</View>
					<View style={style.itemInformation}>
						<IconButton
							icon={'numeric'}
							size={30}
							iconColor={theme.colors.tertiary}
							style={{ margin: 0, padding: 0 }}
						/>
						<Text>Puntos: {store.score}</Text>
					</View>
				</View>
				<ScrollView style={style.map}>
					<View style={style.square}>
						{store.guesses.slice(0, 5).map((_, index) => (
							<Guess
								key={index}
								word={store.word}
								guess={store.guesses[index]}
								isGuessed={index < store.currentGuess}
							/>
						))}
					</View>
					<Button
						mode="elevated"
						style={{ marginVertical: 10, width: '50%', alignSelf: 'center' }}
						buttonColor={theme.colors.primary}
						textColor={theme.colors.secondary}
						onPress={() => store.restartGame()}
					>
						Jugar de nuevo
					</Button>
				</ScrollView>
				<Querty store={store} />
			</View>

			<Portal>
				<Modal
					visible={((store.won || store.lost) && visibleModal) || initVisibleModal}
					contentContainerStyle={styles.modal}
				>
					<View style={styles.subCard}>
						{store.won && (
							<Text style={styles.title}>
								¡Felicidades!{'\n'}Ganaste{'\n'} sigue aprediendo
							</Text>
						)}
						{store.lost && (
							<Text style={styles.title}>
								Perdiste, pero no te preocupes, puedes volver a Jugar de nuevo
							</Text>
						)}
						{initVisibleModal &&
							(loading ? (
								<ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
							) : (
								<>
									<Text style={styles.title}>
										¡Bienvenido {user.first_name} a{'\n'}Adivina la palabra!{'\n'}
									</Text>
									<Text style={styles.subtitle}>Descripción:</Text>
									<Text variant="bodyLarge"> {wordle.wordle_game_description}</Text>
								</>
							))}
						<Text style={styles.title}>Puntuación: {user.first_name}</Text>
					</View>
					<Button
						//style={styles.acceptButton}
						mode="contained"
						onPress={() => {
							if (!initVisibleModal) {
								setVisibleModal(false);
								navigation.goBack();
							} else {
								setInitVisibleModal(false);
							}
						}}
					>
						ACEPTAR
					</Button>
				</Modal>
			</Portal>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		alignItems: 'baseline'
	},
	square: {
		borderWidth: 2,
		borderRadius: 5,
		borderBlockColor: 'black',
		padding: 5,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	map: {
		alignSelf: 'stretch',
		verticalAlign: 'center'
	},
	row: {
		alignSelf: 'stretch',
		flexDirection: 'row',
		justifyContent: 'center'
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
		alignItems: 'center'
	},
	cellText: {
		fontWeight: 'bold'
	},
	modal: {
		height: '80%',
		width: '90%',
		borderRadius: 20,
		justifyContent: 'space-between',
		alignSelf: 'center',
		backgroundColor: '#ECEBEB',
		paddingVertical: 20
	},
	subCard: {
		backgroundColor: '#F3FFE5',
		height: '90%',
		width: '90%',
		marginHorizontal: 0,
		borderRadius: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		gap: 10,
		borderColor: '#A3A3A3',
		borderWidth: 1
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
		color: '#000',
		shadowColor: '#000'
	},
	subtitle: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
		color: '#000'
	},
	clue: {
		width: '75%',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		textAlign: 'center',
		gap: 0
	},
	gameInformation: {
		flexDirection: 'row',
		width: '75%',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemInformation: {
		alignItems: 'center',
		flexDirection: 'row',
		fontVariant: 'bodyLarge'
	}
});

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		flexDirection: 'column',
// 		flexWrap: 'wrap',
// 		gap: 5,
// 		justifyContent: 'flex-start',
// 		alignItems: 'center'
// 	},
// 	modal: {
// 		height: '80%',
// 		width: '90%',
// 		borderRadius: 20,
// 		justifyContent: 'space-between',
// 		alignSelf: 'center',
// 		backgroundColor: '#ECEBEB',
// 		paddingVertical: 20
// 	},
// 	subCard: {
// 		backgroundColor: '#F3FFE5',
// 		height: '90%',
// 		width: '90%',
// 		marginHorizontal: 0,
// 		borderRadius: 10,
// 		alignSelf: 'center',
// 		justifyContent: 'center',
// 		paddingVertical: 10,
// 		gap: 10,
// 		borderColor: '#A3A3A3',
// 		borderWidth: 1
// 	},
// 	title: {
// 		textAlign: 'center',
// 		fontWeight: 'bold',
// 		fontSize: 20,
// 		color: '#000',
// 		shadowColor: '#000'
// 	},
// 	subtitle: {
// 		textAlign: 'center',
// 		fontWeight: 'bold',
// 		fontSize: 16,
// 		color: '#000'
// 	},
// 	text: {
// 		textAlign: 'justify',
// 		marginHorizontal: 10
// 	},
// 	acceptButton: {
// 		width: '90%',
// 		alignSelf: 'center'
// 	}
// });
