import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Button, Card, MD3Theme, useTheme } from 'react-native-paper';
import { transformer } from 'zod';

//función que tomes las pregunta y las opciones de la api
const image = {uri: 'https://i.pinimg.com/564x/e8/a3/dc/e8a3dc3e8a2a108341ddc42656fae863.jpg'};

export function QuizzisGameScreen() {
	const theme = useTheme();
	const styles = createStyles(theme);
	const question = 'Esta es una pregunta'; //halar de la api
	const options = ['opcion 1', 'opcion 2', 'opcion 3', 'opcion 4']; //halar de la api

	return (
		<ImageBackground source={image} resizeMode="cover"style={styles.container}>
			<Text style={[{ margin: 25 }]}>Quizzis Game Screen</Text>
			<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
				<Card style={[styles.cardContainer, { transform: [{ rotateZ: '-8deg' }] }]}>
					<Card style={[styles.cardContainer, { transform: [{ rotateZ: '4deg' }] }]}>
						<Text>{question}</Text>
					</Card>
				</Card>
			</Card>
			<View style={[{ marginTop: 25 }]}>
				<Button style={styles.answer}
				mode='elevated' 
				rippleColor={'#40FF49'} //llevar al onPress
				uppercase={true}
				onPress={() => {}} 
				>
					<Text>{options[0]}</Text>
				</Button>
				<Button style={styles.answer}
				mode='elevated' 
				rippleColor={theme.colors.error} //llevar al onPress
				uppercase={true}
				onPress={() => {}} 
				>
					<Text>{options[0]}</Text>
				</Button>
				<Button style={styles.answer}
				mode='elevated' 
				rippleColor={theme.colors.error} //llevar al onPress
				uppercase={true}
				onPress={() => {}} 
				>
					<Text>{options[0]}</Text>
				</Button>
				<Button style={styles.answer}
				mode='elevated' 
				rippleColor={theme.colors.error} //llevar al onPress
				uppercase={true}
				onPress={() => {}} 
				>
					<Text>{options[0]}</Text>
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
