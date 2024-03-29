import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
	ActivityIndicator,
	Button,
	Dialog,
	IconButton,
	Modal,
	Portal,
	Text,
	useTheme
} from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../../application/auth/user.auth';
import {
	GetWordleGameStoreUseCase,
	GetWordleWordsUseCase,
	sendScoreWordleGameUsecase
} from '../../../../../application/hooks/useWordle';
import Guess from '../../../components/Guess';
import Querty from '../../../components/Qwerty';
const getUseQuery = container.resolve(GetWordleWordsUseCase);
const sendScore = container.resolve(sendScoreWordleGameUsecase);
const getStore = container.resolve(GetWordleGameStoreUseCase);
export default observer(function WordleGameScreen() {
	const store = getStore.useWordleGameStore();
	const [visibleModal, setVisibleModal] = useState(true);
	const [initVisibleModal, setInitVisibleModal] = useState(true);
	const [visibleDialog, setVisibleDialog] = useState(false);
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
	useEffect(() => {
		return () => {
			store.restartGame();
		};
	}, []);

	const attempts = store.attempts;
	const style = styles;
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
			<Portal>
				<Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
					<Dialog.Title>Pista:</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">{wordle.wordle_game_description}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setVisibleDialog(false)}>Cerrar</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
				<Text variant="headlineMedium">Adivina la Palabra</Text>

				<View style={style.gameInformation}>
					<View>
						<Button
							icon="lightbulb"
							mode="text"
							textColor="#B59F3B"
							style={{ margin: 0, padding: 0 }}
							onPress={() => setVisibleDialog(true)}
						>
							Pista
						</Button>
					</View>
					<View style={style.itemInformation}>
						<IconButton icon="gamepad" size={25} iconColor={theme.colors.primary} />
						<Text>Intentos: {attempts}</Text>
					</View>
					<View style={style.itemInformation}>
						<IconButton
							icon="numeric"
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
					contentContainerStyle={{
						...styles.modal,
						height: store.won || store.lost ? '60%' : styles.modal.height
					}}
				>
					<View style={styles.subCard}>
						{store.won && (
							<Text style={styles.title}>¡Felicidades Ganaste !{'\n'} sigue aprediendo</Text>
						)}
						{store.lost && (
							<Text style={styles.title}>
								Perdiste, pero no te preocupes, puedes volver a jugar
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
									<Text style={styles.subtitle}>Instrucciones:</Text>
									<Text variant="bodyLarge" style={styles.textDescription}>
										{wordle.match_game_onboarding}
									</Text>
									<Text style={styles.subtitle}>Descripción del tema:</Text>
									<Text variant="bodyLarge" style={styles.textDescription}>
										{wordle.wordle_game_description}
									</Text>
								</>
							))}
						<Text style={styles.title}>Tu puntuación: {store.score}</Text>
						{store.won && (
							<LottieView
								source={require('../../../../../assets/won.json')}
								autoPlay
								loop
								style={styles.winnerAnimation}
							/>
						)}
						{store.lost && (
							<LottieView
								source={require('../../../../../assets/lost.json')}
								autoPlay
								loop
								style={styles.loserAnimation}
							/>
						)}
					</View>

					<Button
						mode="elevated"
						buttonColor={theme.colors.primary}
						textColor={theme.colors.secondary}
						onPress={() => {
							if (!initVisibleModal) {
								setVisibleModal(false);
								navigation.goBack();
							} else {
								setInitVisibleModal(false);
							}
						}}
						style={styles.button}
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	square: {
		borderWidth: 1,
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
		height: '98%',
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
	button: {
		marginVertical: 10,
		marginHorizontal: 20,
		width: '50%',
		alignSelf: 'center'
	},
	gameInformation: {
		flexDirection: 'row',
		width: '90%',
		gap: 15,
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemInformation: {
		alignItems: 'center',
		flexDirection: 'row',
		fontVariant: 'bodyLarge',
		paddingVertical: 0,
		marginVertical: 0
	},
	textDescription: {
		color: '#000',
		textAlign: 'justify',
		padding: 10
	},
	winnerAnimation: {
		width: '100%',
		height: '70%',
		alignSelf: 'center',
		justifyContent: 'center'
	},
	loserAnimation: {
		width: '100%',
		height: '65%',
		alignSelf: 'center',
		justifyContent: 'center'
	}
});
