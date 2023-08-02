import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Button, Card, MD3Theme, useTheme } from 'react-native-paper';
import GameTimer from '../../components/Game/GameTimer';
//get from API
const image = { uri: 'https://i.pinimg.com/564x/e8/a3/dc/e8a3dc3e8a2a108341ddc42656fae863.jpg' }; //cambiar por la imagen de la api

export function QuizzisGameScreen() {
	//const {minutes, seconds } = useTimer();
	const [timerValue, setTimerValue] = useState({ minutes: 0, seconds: 0 });

	const [question, setQuestion] = useState(0);
	//get from API
	const questionObject = [
		{
			topic: 'Este el tema',
			question: 'Esta es una pregunta',
			options: [
				{
					option: 'Esta es una opción 1',
					status: true
				},
				{
					option: 'Esta es una opción 2',
					status: false
				},
				{
					option: 'Esta es una opción 3',
					status: false
				},
				{
					option: 'Esta es una opción 4',
					status: false
				}
			]
		},
		{
			topic: 'Este el tema 2',
			question: 'Esta es una pregunta2',
			options: [
				{
					option: 'Esta es una opción 1',
					status: true
				},
				{
					option: 'Esta es una opción 2',
					status: false
				},
				{
					option: 'Esta es una opción 3',
					status: false
				},
				{
					option: 'Esta es una opción 4',
					status: false
				}
			]
		}
	];
	const theme = useTheme();
	const styles = createStyles(theme);
	useEffect(() => {
		console.log('timerValue', timerValue);
	}, [timerValue]);

	return (
		<ImageBackground source={image} resizeMode="cover" style={styles.container}>
			<GameTimer timerValue={timerValue} setTimerValue={setTimerValue} />
			<Text style={[{ margin: 25 }]}>{questionObject[question].topic}</Text>
			<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
				<Card style={[styles.cardContainer, { transform: [{ rotateZ: '-8deg' }] }]}>
					<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
						<Text>{questionObject[question].question}</Text>
					</Card>
				</Card>
			</Card>
			<View style={[{ marginTop: 25 }]}>
				<Button
					style={styles.answer}
					mode="elevated"
					uppercase={true}
					onPress={() => {
						console.log(timerValue);
						setQuestion(question + 1);
					}}
					rippleColor={questionObject[question].options[0].status ? '#40FF49' : '#FF4040'}
				>
					<Text>{questionObject[question].options[0].option}</Text>
				</Button>
				<Button
					style={styles.answer}
					mode="elevated"
					uppercase={true}
					onPress={() => {
						setQuestion(question + 1);
					}}
					rippleColor={questionObject[question].options[1].status ? '#40FF49' : '#FF4040'}
				>
					<Text>{questionObject[question].options[1].option}</Text>
				</Button>

				<Button
					style={styles.answer}
					mode="elevated"
					uppercase={true}
					onPress={() => {
						setQuestion(question + 1);
					}}
					rippleColor={questionObject[question].options[2].status ? '#40FF49' : '#FF4040'}
				>
					<Text>{questionObject[question].options[2].option}</Text>
				</Button>

				<Button
					style={styles.answer}
					mode="elevated"
					uppercase={true}
					onPress={() => {
						setQuestion(question + 1);
					}}
					rippleColor={questionObject[question].options[3].status ? '#40FF49' : '#FF4040'}
				>
					<Text>{questionObject[question].options[3].option}</Text>
				</Button>
			</View>
		</ImageBackground>
	);
}

const createStyles = (theme: MD3Theme) =>
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
		answer: {
			width: 250,
			height: 40,
			margin: 15,
			borderRadius: 10,
			backgroundColor: '#ffffff'
		}
	});
