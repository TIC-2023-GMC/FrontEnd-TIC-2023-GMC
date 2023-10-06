import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../../application/auth/user.auth';
import { GetWordleGameStoreUseCase } from '../../../../../application/hooks';
import Guess from '../../../components/Guess';
import Querty from '../../../components/Qwerty';
const getStore = container.resolve(GetWordleGameStoreUseCase);
export default observer(function WordleGameScreen() {
	const store = getStore.useWordleGameStore();
	const [visibleModal, setVisibleModal] = useState(true);
	const [initVisibleModal, setInitVisibleModal] = useState(true);
	const navigation = useNavigation();
	const { user } = useContext<UserContextParams>(UserContext);
	const theme = useTheme();
	useEffect(() => {
		store.init();
	}, []);
	return (
		<View style={styles.container}>
			<Text variant="headlineMedium">Adivina la Palabra</Text>
			{store.guesses.map((_, index) => (
				<Guess
					key={index}
					word={store.word}
					guess={store.guesses[index]}
					isGuessed={index < store.currentGuess}
				/>
			))}
			<Button
				mode="elevated"
				buttonColor={theme.colors.primary}
				textColor={theme.colors.secondary}
				onPress={() => store.init()}
			>
				Jugar de nuevo
			</Button>
			<Querty store={store} />
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
						{initVisibleModal && (
							<>
								<Text style={styles.title}>
									¡Bienvenido {user.first_name} a{'\n'}Adivina la palabra!{'\n'}
								</Text>
								<Text style={styles.subtitle}>Descripción:</Text>
								<Text variant="bodyLarge" style={styles.text}>
									El juego consiste en adivinar la palabra que se muestra en la pantalla, para ello
									tienes 5 intentos, se irá mostrando una letra de la palabra, si adivinas la
									palabra antes de que se acaben los intentos ganas, si no, pierdes.
								</Text>
							</>
						)}
						<Text style={styles.title}>Puntuación: {user.first_name}</Text>
					</View>
					<Button
						style={styles.acceptButton}
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
		flex: 1,
		flexDirection: 'column',
		flexWrap: 'wrap',
		gap: 5,
		justifyContent: 'flex-start',
		alignItems: 'center'
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
	text: {
		textAlign: 'justify',
		marginHorizontal: 10
	},
	acceptButton: {
		width: '90%',
		alignSelf: 'center'
	}
});
