import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Button, Card, Text, Modal, Portal, Snackbar } from 'react-native-paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QuizGameMatch, UserScore } from '../../../models/InterfacesModels';
import { get, put } from '../../../services/api';
import { useStopwatch } from 'react-timer-hook';
import { UserContext, UserContextParams } from '../../../auth/userContext';
import {
	getLeaderBoardEndpoint,
	getQuizGameByUserEndpoint,
	getQuizGameEndpoint
} from '../../../services/endpoints';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GameTabNavigation } from '../../../models/types';

const timeOutAnswer = 3000;
const image = { uri: 'https://i.pinimg.com/564x/e8/a3/dc/e8a3dc3e8a2a108341ddc42656fae863.jpg' }; //cambiar por la imagen de la api
const levelImages = { uri: 'https://usagif.com/wp-content/uploads/gif/confetti-25.gif' };

export function QuizGameScreen() {
	const styles = createStyles();
	const { user } = useContext<UserContextParams>(UserContext);
	const [question, setQuestion] = useState(-1);
	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation<NavigationProp<GameTabNavigation>>();
	const [isClicked, setIsClicked] = useState(-1);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const { totalSeconds, seconds, minutes, pause, reset } = useStopwatch({
		autoStart: true
	});
	const [quizzGame, setQuizzGame] = useState<QuizGameMatch>({
		_id: '',
		user_id: user._id ? user._id : '',
		match_name: '',
		match_game_score: 0,
		match_game_time: 0,
		match_game_onboarding: '',
		match_game_questions: []
	});

	useQuery({
		queryKey: ['question'],
		queryFn: async () => {
			const response = await get<QuizGameMatch>(getQuizGameByUserEndpoint(user));
			return response.data;
		},
		onSuccess: (data: QuizGameMatch) => {
			data.match_game_score = 0;
			data.match_game_time = 0;
			setQuizzGame(data);
			setQuestion(data?.match_game_questions?.length ? data?.match_game_questions?.length - 1 : 0);
		}
	});

	const sendScoreQuizzGame = useMutation({
		mutationFn: (data: QuizGameMatch) =>
			put(getQuizGameEndpoint(), data).then((response) => response.data)
	});

	const { data, isSuccess, isLoading, isFetching } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: async () => {
			const response = await get(getLeaderBoardEndpoint(user));
			return response.data;
		},
		enabled: sendScoreQuizzGame.isSuccess
	});

	useEffect(() => {
		if (question === 0) {
			sendScoreQuizzGame.mutate(quizzGame);
		}
	}, [quizzGame.match_game_score]);

	const handlePress = (answerIndex: number) => {
		setIsClicked(answerIndex);
		setSnackbarVisible(true);
		setTimeout(() => setIsClicked(-1), timeOutAnswer - 100); // Cambia el color de vuelta después de 2 segundos
	};
	return (
		<ImageBackground source={image} resizeMode="cover" style={styles.container}>
			<Text style={styles.timer}>
				{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
			</Text>
			<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
				<Card style={[styles.cardContainer, { transform: [{ rotateZ: '-8deg' }] }]}>
					<Card
						style={[
							styles.cardContainer,
							{ transform: [{ rotateZ: '4deg' }], paddingHorizontal: 20 }
						]}
					>
						<Text style={styles.questionText}>
							{quizzGame.match_game_questions.length > 0
								? quizzGame.match_game_questions[question].question_text
								: ''}
						</Text>
					</Card>
				</Card>
			</Card>
			<View style={styles.answerContainer}>
				{quizzGame.match_game_questions.length > 0 &&
					quizzGame.match_game_questions[question].answers.map((data, index) => (
						<TouchableOpacity
							key={index}
							disabled={isClicked !== -1}
							style={[
								styles.buttonAnswer,
								isClicked !== -1 ? (data.is_correct ? styles.clicked : styles.notClicked) : null
							]}
							onPress={() => {
								handlePress(index);
								setTimeout(() => {
									setQuestion((prevQuestion) => (prevQuestion === 0 ? 0 : prevQuestion - 1));
								}, timeOutAnswer);
								setQuizzGame((prevQuizzGame) => {
									if (data.is_correct) {
										const object: QuizGameMatch = {
											...prevQuizzGame,
											match_game_score: prevQuizzGame.match_game_score + 1
										};
										return object;
									}
									return prevQuizzGame;
								});

								if (question === 0) {
									pause();
									setQuizzGame((prevQuizzGame) => {
										const object: QuizGameMatch = {
											...prevQuizzGame,
											match_game_time: totalSeconds,

											match_game_score: Math.round(
												prevQuizzGame.match_game_score * 10 +
													(10 * Math.pow(prevQuizzGame.match_game_score, 2)) / totalSeconds
											)
										};
										return object;
									});

									setTimeout(() => {
										setModalVisible(true);
									}, 2000);
								}
							}}
						>
							<Text style={styles.buttonText}>{data.answer_text}</Text>
						</TouchableOpacity>
					))}
			</View>
			{quizzGame.match_game_questions.length > 0 && (
				<Snackbar
					onIconPress={() => setSnackbarVisible(false)}
					icon={
						quizzGame.match_game_questions[question].answers[isClicked]
							? quizzGame.match_game_questions[question].answers[isClicked].is_correct
								? 'check-all'
								: 'close'
							: ''
					}
					style={styles.snackbarStyle}
					duration={timeOutAnswer - 1000}
					visible={snackbarVisible}
					onDismiss={() => setSnackbarVisible(false)}
				>
					{quizzGame.match_game_questions[question].answers[isClicked]
						? !quizzGame.match_game_questions[question].answers[isClicked].is_correct
							? 'Oh no! Respuesta incorrecta'
							: 'Muy bien! Respuesta correcta'
						: ''}
				</Snackbar>
			)}
			<Portal>
				<Modal
					contentContainerStyle={styles.leaderboardModal}
					dismissable={false}
					visible={modalVisible}
					onDismiss={() => {
						setModalVisible(!modalVisible);
					}}
				>
					<Image source={levelImages} style={styles.leaderboardBackgroundImage} />
					{isFetching || isLoading ? (
						<ActivityIndicator animating={true} size="large"></ActivityIndicator>
					) : (
						sendScoreQuizzGame.isSuccess &&
						isSuccess && (
							<>
								<View style={styles.gameStatisticsContainer}>
									<Text style={styles.statisticsText}>
										¡Felicidades!{'\n'}Has completado el Quiz.
									</Text>
									<Text style={styles.statisticsText}>
										Tiempo: {minutes < 10 ? '0' + minutes : minutes}:
										{seconds < 10 ? '0' + seconds : seconds}
									</Text>
									<Text style={styles.statisticsText}>
										Puntuación: {quizzGame.match_game_score}
									</Text>
								</View>
								<View style={styles.leaderboardContainer}>
									<Text style={styles.leaderboardTextTitle}>Tabla de Posiciones</Text>
									<View style={styles.leaderboardHeaderGroup}>
										<Text style={[styles.leaderboardHeader, styles.positionWidth]}>Pos</Text>
										<Text style={[styles.leaderboardHeader, styles.pointsWidth]}>Puntos</Text>
										<Text style={[styles.leaderboardHeader, styles.playerNameWidth]}>Jugador</Text>
									</View>

									{isSuccess &&
										data[0]?.map((entry: UserScore, index: number) => (
											<View key={index} style={styles.leaderboardHeaderGroup}>
												<Text style={[styles.leaderboardScoreText, styles.positionWidth]}>
													{index + 1}°
												</Text>
												<Text style={[styles.leaderboardScoreText, styles.pointsWidth]}>
													{entry.match_game_score}
												</Text>
												<Text style={[styles.leaderboardScoreText, styles.playerNameWidth]}>
													{entry.user_first_name + '\n' + entry.user_last_name}
												</Text>
											</View>
										))}

									<Text style={styles.leaderboardTextTitle}>Tu posición:</Text>
									<View style={styles.leaderboardHeaderGroup}>
										<Text style={[styles.leaderboardScoreText, styles.positionWidth]}>
											{data[1]}°
										</Text>
										<Text style={[styles.leaderboardScoreText, styles.pointsWidth]}>
											{quizzGame.match_game_score}
										</Text>
										<Text style={[styles.leaderboardScoreText, styles.playerNameWidth]}>
											{user.first_name + '\n' + user.last_name}
										</Text>
									</View>
								</View>
								<Button
									style={styles.acceptButton}
									mode="contained"
									onPress={() => {
										setModalVisible(!modalVisible);
										reset();
										navigation.goBack();
									}}
								>
									ACEPTAR
								</Button>
							</>
						)
					)}
				</Modal>
			</Portal>
		</ImageBackground>
	);
}

const createStyles = () =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#fff',
			alignItems: 'center',
			flexDirection: 'column'
		},
		cardContainer: {
			width: 325,
			height: 150,
			backgroundColor: '#F3FFE5',
			justifyContent: 'center',
			alignItems: 'center'
		},
		timer: {
			fontSize: 35,
			fontWeight: 'bold',
			color: '#333',
			textAlign: 'center'
		},
		questionText: {
			fontSize: 20,
			fontWeight: 'bold',
			textAlign: 'center'
		},
		answerContainer: {
			marginTop: 25,
			backgroundColor: '#A3A3A3',
			width: '90%',
			padding: 25,
			borderRadius: 10,
			alignSelf: 'center',
			alignItems: 'center',
			justifyContent: 'center'
		},
		buttonAnswer: {
			width: '100%',
			marginTop: 20,
			borderRadius: 10,
			backgroundColor: '#ffffff',
			textAlign: 'center',
			paddingHorizontal: 20
		},
		buttonText: {
			textAlign: 'center',
			fontSize: 18,
			paddingVertical: 2,
			paddingHorizontal: 2
		},
		modalContainer: {
			width: '90%',
			borderRadius: 20,
			justifyContent: 'center',
			alignSelf: 'center',
			backgroundColor: '#ffffff'
		},
		leaderboardModal: {
			height: '80%',
			width: '90%',
			borderRadius: 20,
			justifyContent: 'space-between',
			alignSelf: 'center',
			backgroundColor: '#ECEBEB',
			paddingVertical: 20
		},
		leaderboardBackgroundImage: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		gameStatisticsContainer: {
			backgroundColor: '#F3FFE5',
			width: '90%',
			height: '25%',
			borderRadius: 10,
			alignSelf: 'center',
			justifyContent: 'space-between',
			paddingVertical: 10,
			borderColor: '#A3A3A3',
			borderWidth: 1
		},
		statisticsText: {
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: 20,
			color: '#000',
			shadowColor: '#000'
		},
		leaderboardContainer: {
			backgroundColor: '#A3A3A3',
			width: '90%',
			height: '62%',
			borderRadius: 10,
			alignSelf: 'center',
			paddingVertical: 10,
			alignItems: 'center'
		},
		leaderboardTextTitle: {
			color: '#ffffff',
			fontWeight: 'bold',
			fontSize: 20,
			textAlign: 'center',
			fontFamily: 'sans-serif'
		},
		leaderboardHeaderGroup: {
			width: '90%',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginVertical: 5
		},
		leaderboardHeader: {
			justifyContent: 'center',
			backgroundColor: '#F3FFE5',
			textAlign: 'center',
			fontFamily: 'sans-serif',
			fontSize: 15,
			color: '#000000',
			borderRadius: 5
		},
		positionWidth: {
			width: '15%'
		},
		pointsWidth: {
			width: '25%'
		},
		playerNameWidth: {
			width: '50%'
		},
		leaderboardScoreText: {
			width: 'auto',
			paddingHorizontal: 10,
			justifyContent: 'center',
			backgroundColor: 'rgba(255,255,255,0.5)',
			textAlign: 'center',
			fontFamily: 'sans-serif',
			fontSize: 17,
			color: '#000',
			borderRadius: 5,
			textAlignVertical: 'center'
		},
		acceptButton: {
			width: '90%',
			alignSelf: 'center'
		},
		clicked: { backgroundColor: '#98FB98' },
		notClicked: { backgroundColor: '#FF6B6B' },
		snackbarStyle: {
			width: '90%',
			alignSelf: 'center',
			marginBottom: 20
		}
	});
