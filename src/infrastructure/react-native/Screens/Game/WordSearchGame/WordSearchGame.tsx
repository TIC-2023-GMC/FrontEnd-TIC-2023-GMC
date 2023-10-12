import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Chip,
	Dialog,
	Modal,
	Portal,
	useTheme
} from 'react-native-paper';

import { observer } from 'mobx-react';
import { useTimer } from 'react-timer-hook';
import WordSearchBoard from '../../../components/WordSearchBoard';
import { container } from 'tsyringe';
import {
	GetWordSearchGameMatchUseCase,
	GetWordSearchStoreUseCase
} from '../../../../../application/hooks/useWordSearchMatch';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GameTabNavigation } from '../../../../../domain/types/types';

const getWordSearchGameMatch = container.resolve(GetWordSearchGameMatchUseCase);
const getWordSearchStore = container.resolve(GetWordSearchStoreUseCase);

function WordSearchScreen() {
	const navigation = useNavigation<NavigationProp<GameTabNavigation>>();
	const theme = useTheme();
	const [openInfoModal, setOpenInfoModal] = useState(true);
	const [openCluesModal, setOpenCluesModal] = useState(false);
	const { setAnswers, checkCompletedWord, answers, resetBoard, isBoardWin } =
		getWordSearchStore.useWordSearchStore();

	const { loading, data } = getWordSearchGameMatch.useQueryWordSearchGame();

	const [openFailModal, setOpenFailModal] = useState(false);
	const [openSuccessModal, setOpenSuccessModal] = useState(true);

	const { seconds, start, pause } = useTimer({
		expiryTimestamp: new Date(new Date().getTime() + 60 * 1000),
		autoStart: false,
		onExpire: () => {
			setOpenFailModal(true);
		}
	});

	useEffect(() => {
		data && setAnswers(data.match_game_topic.statements);

		return () => {
			resetBoard();
		};
	}, [data]);

	useEffect(() => {
		if (isBoardWin) {
			pause();
		}
	}, [isBoardWin]);

	return (
		<>
			{loading ? (
				<ActivityIndicator style={{ flex: 1 }} size="large" />
			) : (
				<>
					<Text style={{ ...styles.timer, color: theme.colors.primary }}>
						Tiempo restante: {seconds ? seconds : '60'}
					</Text>

					<View style={{ justifyContent: 'space-evenly', alignItems: 'center' }}>
						{answers.map((answer, index) => {
							return (
								<Chip
									key={index}
									style={{
										width: '60%',
										marginBottom: 3,
										backgroundColor: checkCompletedWord(answer)
											? '#4caf5066'
											: theme.colors.secondary,
										borderColor: theme.colors.tertiary,
										borderWidth: 1
									}}
									textStyle={{
										fontSize: 16,
										textAlign: 'center'
									}}
									icon={`${checkCompletedWord(answer) ? 'check' : 'magnify'}`}
								>
									{index + 1}. {answer.answer}
								</Chip>
							);
						})}
					</View>
					<View style={styles.container}>
						<WordSearchBoard store={getWordSearchStore.useWordSearchStore()} />
					</View>
					<View style={styles.buttonView}>
						<Button
							style={styles.buttonOptions}
							onPress={() => setOpenInfoModal(true)}
							mode="elevated"
							buttonColor={theme.colors.tertiary}
							textColor={theme.colors.secondary}
						>
							INSTRUCCIONES
						</Button>
						<Button
							style={styles.buttonOptions}
							onPress={() => setOpenCluesModal(true)}
							mode="elevated"
							buttonColor={theme.colors.primary}
							textColor={theme.colors.secondary}
						>
							PISTAS
						</Button>
					</View>
					<Modal
						contentContainerStyle={styles.infoModal}
						visible={openInfoModal}
						onDismiss={() => {
							start();
							setOpenInfoModal(false);
						}}
					>
						<Text style={styles.infoTitleText}>Tema: {data?.match_game_topic.title}</Text>
						<View style={styles.infoContainer}>
							<Text style={styles.infoText}>{data?.match_game_topic.info}</Text>
						</View>
						<View style={styles.infoContainer}>
							<Text style={{ ...styles.instructionsText, fontWeight: 'bold' }}>Instrucciones:</Text>
							<Text style={styles.instructionsText}>
								Para jugar, revisa la información del tema y las pistas proporcionadas para
								encontrar las palabras correspondientes en la sopa de letras. Para que una palabra
								se marque como &ldquo;encontrada&rdquo;, debes seleccionar todas las letras de dicha
								palabra. Encuentra todas las palabras en el tiempo indicado (60 segundos).
							</Text>
						</View>
						<Button
							style={styles.buttonModal}
							mode="elevated"
							buttonColor={theme.colors.primary}
							textColor={theme.colors.secondary}
							onPress={() => {
								start();
								setOpenInfoModal(false);
							}}
						>
							¡Entendido!
						</Button>
					</Modal>
					<Modal
						contentContainerStyle={styles.cluesModal}
						visible={openCluesModal}
						onDismiss={() => {
							setOpenCluesModal(false);
						}}
					>
						<Text style={styles.infoTitleText}>Tema: {data?.match_game_topic.title}</Text>
						<View style={styles.cluesContainer}>
							<FlatList
								data={answers}
								renderItem={({ item, index }) => (
									<Text style={styles.instructionsText}>
										{index + 1}. {item.clue}
									</Text>
								)}
								keyExtractor={(item) => item.number.toString()}
							/>
						</View>
						<Button
							style={styles.buttonModal}
							mode="elevated"
							buttonColor={theme.colors.primary}
							textColor={theme.colors.secondary}
							onPress={() => {
								setOpenCluesModal(false);
							}}
						>
							¡Entendido!
						</Button>
					</Modal>
					<Portal>
						<Dialog
							dismissable={false}
							visible={
								//answers.every((answer) => checkCompletedWord(answer)) &&
								//isBoardWin && seconds > 0 && openSuccessModal}
								isBoardWin && seconds > 0 && openSuccessModal
								//openSuccessModal
							}
						>
							<Dialog.Title>¡Felicidades, lo has logrado!</Dialog.Title>
							<Dialog.Content>
								<Text style={styles.infoText}>Recuerda que...{'\n'}</Text>
								<Text style={styles.dialogText}>{data?.match_game_topic.info}</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button
									onPress={() => {
										setOpenSuccessModal(false);
										navigation.goBack();
									}}
								>
									REGRESAR A JUEGOS
								</Button>
							</Dialog.Actions>
						</Dialog>
						<Dialog dismissable={false} visible={openFailModal}>
							<Dialog.Title>¡No lo lograste!</Dialog.Title>
							<Dialog.Content>
								<Text style={styles.infoText}>Vuelve a intentarlo y recuerda que...{'\n'}</Text>
								<Text style={styles.dialogText}>{data?.match_game_topic.info}</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button
									onPress={() => {
										setOpenFailModal(false);
										navigation.goBack();
									}}
								>
									REGRESAR A JUEGOS
								</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				</>
			)}
		</>
	);
}
export default observer(WordSearchScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	timer: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'black',
		textAlign: 'center',
		marginVertical: 5
	},
	buttonView: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginHorizontal: 10,
		marginBottom: 20,
		marginTop: 5
	},
	buttonOptions: {
		width: '45%'
	},
	infoModal: {
		height: '80%',
		width: '90%',
		borderRadius: 20,
		justifyContent: 'space-between',
		alignSelf: 'center',
		backgroundColor: '#ECEBEB',
		paddingVertical: 20
	},
	cluesModal: {
		height: '50%',
		width: '90%',
		borderRadius: 20,
		justifyContent: 'space-between',
		alignSelf: 'center',
		backgroundColor: '#ECEBEB',
		paddingVertical: 20
	},
	infoTitleText: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 20,
		color: '#000',
		shadowColor: '#000'
	},
	infoContainer: {
		backgroundColor: '#F3FFE5',
		width: '90%',
		height: '40%',
		borderRadius: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		padding: 10,
		borderColor: '#A3A3A3',
		borderWidth: 1
	},
	cluesContainer: {
		backgroundColor: '#F3FFE5',
		width: '90%',
		height: 'auto',
		borderRadius: 10,
		alignSelf: 'center',
		justifyContent: 'space-around',
		padding: 10,
		borderColor: '#A3A3A3',
		borderWidth: 1,
		marginBottom: 5
	},
	infoText: { textAlign: 'justify', fontSize: 16, fontStyle: 'italic' },
	instructionsText: { textAlign: 'left', fontSize: 16 },
	dialogText: { textAlign: 'justify', fontSize: 16 },
	buttonModal: {
		width: '60%',
		alignSelf: 'center'
	}
});
