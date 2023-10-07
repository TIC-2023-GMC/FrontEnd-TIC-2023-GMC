import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Button, Modal } from 'react-native-paper';

import Svg, { Rect } from 'react-native-svg';

export default function SearchWordsScreen() {
	const [openModal, setOpenModal] = useState(false);
	const [answers, setAnswers] = useState([
		{
			type: 'horizontal',
			number: 1,
			question: 'test1',
			answer: 'te1'
		},
		{
			type: 'vertical',
			number: 2,
			question: 'test2',
			answer: 'te2'
		},
		{
			type: 'horizontal',
			number: 3,
			question: 'test3',
			answer: 'te3'
		}
	]);

	const blackTiles = [
		[0, 0],
		[1, 0],
		[3, 0],
		[4, 0],
		[5, 0],
		[6, 0],
		[7, 0],
		[6, 1],
		[7, 1],
		[0, 2],
		[1, 2],
		[3, 2],
		[4, 2],
		[5, 2],
		[6, 2],
		[7, 2],
		[6, 3],
		[7, 3],
		[1, 4],
		[3, 4],
		[4, 4],
		[5, 4],
		[6, 4],
		[7, 4],
		[1, 5],
		[6, 5],
		[7, 5],
		[1, 6],
		[2, 6],
		[3, 6],
		[4, 6],
		[6, 6],
		[7, 6],
		[4, 7],
		[6, 7],
		[7, 7]
	];

	const boardSize = 8; // Change this to adjust the size of the board

	const renderBoard = () => {
		const board = [];

		for (let i = 0; i < boardSize; i++) {
			for (let j = 0; j < boardSize; j++) {
				if (blackTiles.some((tile) => tile[0] === i && tile[1] === j)) {
					board.push(
						<Rect
							key={`${i}-${j}`}
							x={j * 45}
							y={i * 45}
							width="45"
							height="45"
							fill="black"
							stroke="black"
							strokeWidth="1"
						/>
					);
				} else {
					board.push(
						<Rect
							key={`${i}-${j}`}
							x={j * 45}
							y={i * 45}
							width="45"
							height="45"
							fill="white"
							stroke="black"
							strokeWidth="1"
						/>
					);
				}
			}
		}

		return board;
	};

	return (
		<>
			<View style={styles.container}>
				<Svg width="100%" height="60%">
					{renderBoard()}
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
