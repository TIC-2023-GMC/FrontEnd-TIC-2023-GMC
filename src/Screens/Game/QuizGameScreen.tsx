import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableHighlight } from 'react-native';
import { ActivityIndicator, Button, Card, Text, Modal, Portal } from 'react-native-paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GameQuiz, UserScore } from '../../models/InterfacesModels';
import { get, put } from '../../services/api';
import { useStopwatch } from 'react-timer-hook';
import { UserContext, UserContextParams } from '../../auth/userContext';

//get from API
const image = { uri: 'https://i.pinimg.com/564x/e8/a3/dc/e8a3dc3e8a2a108341ddc42656fae863.jpg' }; //cambiar por la imagen de la api
const level_images = { uri: 'https://usagif.com/wp-content/uploads/gif/confetti-25.gif' };
export function QuizGameScreen({
	visible,
	setVisible
}: {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { user } = useContext<UserContextParams>(UserContext);
	const [quizzGame, setQuizzGame] = useState<GameQuiz>({
		_id: '',
		user_id: user._id ? user._id : '',
		game_name: '',
		game_description: '',
		game_image: { _id: '', img_path: '' },
		game_category: '',
		game_score: 0,
		game_questions: [],
		game_time: 0
	});
	const [question, setQuestion] = useState(-1);
	const [modalVisible, setModalVisible] = useState(false);
	const { totalSeconds, seconds, minutes, pause, reset } = useStopwatch({
		autoStart: true
	});

	useQuery({
		queryKey: ['question'],
		queryFn: async () => {
			const response = await get<GameQuiz>(`game/quiz_game?user_id=${user._id}`);
			return response.data;
		},
		onSuccess: (data: GameQuiz) => {
			data.game_score = 0;
			data.game_time = 0;
			setQuizzGame(data);
			setQuestion(data?.game_questions?.length ? data?.game_questions?.length - 1 : 0);
		}
	});
	const sendScoreQuizzGame = useMutation({
		mutationFn: (data: GameQuiz) => put('/game/quiz_game', data).then((response) => response.data)
	});

	const { data, isSuccess, isLoading, isFetching } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: async () => {
			const response = await get(`/game/leaderboard?user_id=${user._id}`);
			return response.data;
		},
		enabled: sendScoreQuizzGame.isSuccess
	});

	const styles = createStyles();
	useEffect(() => {
		if (question === 0) {
			sendScoreQuizzGame.mutate(quizzGame);
		}
	}, [quizzGame.game_score]);

	return (
		<ImageBackground source={image} resizeMode="cover" style={styles.container}>
			<Text>
				{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
			</Text>
			<Text style={{ margin: 25 }}>{quizzGame?.game_description}</Text>
			<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
				<Card style={[styles.cardContainer, { transform: [{ rotateZ: '-8deg' }] }]}>
					<Card
						style={[
							styles.cardContainer,
							{ transform: [{ rotateZ: '4deg' }], paddingHorizontal: 20 }
						]}
					>
						<Text style={styles.questionStyle}>
							{quizzGame.game_questions.length > 0
								? quizzGame.game_questions[question].question_text
								: ''}
						</Text>
					</Card>
				</Card>
			</Card>
			<View style={{ marginTop: 25 }}>
				{quizzGame.game_questions.length > 0 &&
					quizzGame.game_questions[question].answers.map((data, index) => (
						<TouchableHighlight
							key={index}
							style={styles.buttonAnswer}
							onPress={() => {
								setQuestion((prevQuestion) => (prevQuestion === 0 ? 0 : prevQuestion - 1));
								setQuizzGame((prevQuizzGame) => {
									if (data.is_correct) {
										const object: GameQuiz = {
											...prevQuizzGame,
											game_score: prevQuizzGame.game_score + 1
										};
										return object;
									}
									return prevQuizzGame;
								});

								if (question === 0) {
									pause();
									setQuizzGame((prevQuizzGame) => {
										const object: GameQuiz = {
											...prevQuizzGame,
											game_time: totalSeconds,

											game_score: Math.round(
												prevQuizzGame.game_score * 10 +
													(10 * Math.pow(prevQuizzGame.game_score, 2)) / totalSeconds
											)
										};
										return object;
									});

									setModalVisible(true);
								}
							}}
							underlayColor={data.is_correct ? '#40FF49' : '#FF4040'}
						>
							<Text style={styles.buttonText}>{data.answer_text}</Text>
						</TouchableHighlight>
					))}
				<Portal>
					<Modal
						contentContainerStyle={{
							width: '90%',
							borderRadius: 20,
							justifyContent: 'center',
							alignSelf: 'center',
							backgroundColor: '#ffffff'
						}}
						dismissable={false}
						visible={modalVisible}
						onDismiss={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<Image source={level_images} style={styles.backgroundImage} />
						{isFetching || isLoading ? (
							<ActivityIndicator animating={true} size="large"></ActivityIndicator>
						) : (
							sendScoreQuizzGame.isSuccess &&
							isSuccess && (
								<>
									<View style={styles.match}>
										<Text style={styles.modalText}>¡Felcidades! {'\n'}Has Completado el Quiz</Text>
										<Text style={styles.modalText}>
											Tiempo: {minutes < 10 ? '0' + minutes : minutes}:
											{seconds < 10 ? '0' + seconds : seconds}
										</Text>
										<Text style={styles.modalText}>Puntuación: {quizzGame.game_score}</Text>
									</View>
									<View style={styles.leaderboard}>
										<Text style={styles.leaderboardTextitle}>Tabla de Posiciones</Text>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between'
											}}
										>
											<Text style={{ ...styles.leaderboardHeader, width: '15%', marginLeft: 15 }}>
												Pos
											</Text>
											<Text style={{ ...styles.leaderboardHeader, width: '22%' }}>Puntos</Text>
											<Text style={{ ...styles.leaderboardHeader, width: '40%', marginRight: 20 }}>
												Jugador
											</Text>
										</View>
										{isSuccess &&
											data[0]?.map((entry: UserScore, index: number) => (
												<Card.Title
													key={index}
													title={`${index + 1}°       ${entry.game_score}           ${
														entry.user_first_name
													} ${entry.user_last_name}`}
													titleStyle={styles.leaderboardText}
												/>
											))}
										<Text style={styles.leaderboardTextitle}>Tu posición:</Text>
										<Card.Title
											title={`${data[1]}°       ${quizzGame.game_score}             ${user.first_name} ${user.last_name}`}
											titleStyle={styles.leaderboardText}
										/>
									</View>
									<Button
										style={styles.acceptButton}
										mode="contained"
										onPress={() => {
											setModalVisible(!modalVisible);
											reset();
											setVisible(!visible);
										}}
									>
										ACEPTAR
									</Button>
								</>
							)
						)}
					</Modal>
				</Portal>
			</View>
		</ImageBackground>
	);
}

const createStyles = () =>
	StyleSheet.create({
		container: {
			height: '100%',
			alignItems: 'center',
			paddingTop: 50
		},
		cardContainer: {
			width: 325,
			height: 150,
			justifyContent: 'center',
			alignItems: 'center'
		},
		questionStyle: {
			fontSize: 20,
			fontWeight: 'bold',
			textAlign: 'center'
		},
		buttonAnswer: {
			width: 'auto',
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
		match: {
			backgroundColor: '#EDE4AB',
			width: '88%',
			height: '23%',
			borderRadius: 10,
			marginBottom: 20,
			alignSelf: 'center'
		},

		textStyle: {
			color: 'white',
			fontWeight: 'bold',
			textAlign: 'center'
		},
		modalText: {
			marginBottom: 15,
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: 20,
			color: '#534F6E'
		},
		backgroundImage: {
			position: 'absolute',
			width: '100%',
			height: '100%'
		},
		leaderboard: {
			backgroundColor: '#B2AAED',
			width: '88%',
			height: '50%',
			borderRadius: 10,
			marginBottom: 20,
			alignSelf: 'center'
		},
		leaderboardTextitle: {
			color: '#ffffff',
			fontWeight: 'bold',
			fontSize: 20,
			textAlign: 'center',
			fontFamily: 'sans-serif'
		},
		leaderboardHeader: {
			backgroundColor: '#EDE4AB',
			paddingHorizontal: 5,
			textAlign: 'center',
			fontFamily: 'sans-serif',
			fontSize: 17,
			color: '#000000',
			width: '35%'
		},
		leaderboardText: {
			paddingHorizontal: 20,
			fontFamily: 'sans-serif',
			fontSize: 17,
			color: '#534F6E',
			backgroundColor: 'rgba(255,255,255,0.5)',
			marginRight: 15,
			borderRadius: 5
		},
		acceptButton: {
			width: '88%',
			alignSelf: 'center'
		}
	});
