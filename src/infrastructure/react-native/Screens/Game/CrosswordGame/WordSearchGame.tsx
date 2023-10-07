import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Modal } from 'react-native-paper';
import store from './WordSearchStore';

import { observer } from 'mobx-react';
import Svg from 'react-native-svg';
import { CrosswordAnswer } from '../../../../../domain/models/InterfacesModels';
import WordSearchBoard from '../../../components/WordSearchBoard';

function WordSearchScreen() {
	const [openModal, setOpenModal] = useState(false);
	const { setAnswers } = store;
	const answers: CrosswordAnswer[] = [
		{
			type: 'horizontal',
			number: 1,
			question: 'Nombre del país más grande de Sudamérica',
			answer: 'Brasil'
		},
		{
			type: 'vertical',
			number: 2,
			question: 'Capital de Francia',
			answer: 'París'
		},
		{
			type: 'horizontal',
			number: 3,
			question: 'Idioma oficial de Japón',
			answer: 'Japonés'
		},
		{
			type: 'horizontal',
			number: 4,
			question: 'Río que atraviesa Egipto',
			answer: 'Nilo'
		},
		{
			type: 'vertical',
			number: 5,
			question: 'Cadena montañosa que separa Europa de Asia',
			answer: 'Urales'
		},
		{
			type: 'horizontal',
			number: 6,
			question: 'Capital de Australia',
			answer: 'Canberra'
		},
		{
			type: 'vertical',
			number: 7,
			question: 'Océano más grande del mundo',
			answer: 'Pacífico'
		},
		{
			type: 'horizontal',
			number: 8,
			question: 'Cuarto planeta del sistema solar',
			answer: 'Marte'
		}
	];

	useEffect(() => {
		setAnswers(answers);
	}, []);

	return (
		<>
			<View style={styles.container}>
				<Svg width="100%" height="60%">
					<WordSearchBoard store={store} />
				</Svg>
			</View>
			<Modal visible={openModal} onDismiss={() => setOpenModal(false)}>
				<View style={{ backgroundColor: 'green' }}>
					<FlatList
						data={answers}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									setOpenModal(false);
									console.log(item);
								}}
							>
								<Text style={{ color: 'white' }}>{item.question}</Text>
								<Text style={{ color: 'white' }}>{item.answer}</Text>
							</TouchableOpacity>
						)}
						keyExtractor={(item) => item.number.toString()}
					/>
				</View>
			</Modal>
			<Button onPress={() => setOpenModal(true)}>Change</Button>
		</>
	);
}
export default observer(WordSearchScreen);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
		paddingHorizontal: 10,
		justifyContent: 'space-evenly'
	},
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
