import { observer } from 'mobx-react';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Rect, Svg, Text } from 'react-native-svg';
import { Dimensions } from 'react-native';
import { IWordSearchStore } from '../../../domain/services/IWordSearchStore';

const WordSearchBoard = ({ store }: { store: IWordSearchStore }) => {
	const {
		maxCols: horizontalBoardSize,
		maxRows: verticalBoardSize,
		board,
		isCellSelected,
		deselectCell,
		selectCell
	} = store;

	const cellSize = 32;
	const theme = useTheme();

	const boardVisual = [];
	const fillColor = (
		cellContent: { letter: string; wordNumber: number; isCompleted: boolean },
		i: number,
		j: number
	) =>
		cellContent.isCompleted
			? '#4caf5066'
			: isCellSelected(i, j)
			? theme.colors.tertiary
			: theme.colors.secondary;

	const handleCellClick = (i: number, j: number) => {
		if (isCellSelected(i, j)) {
			deselectCell(i, j);
		} else {
			selectCell(i, j);
		}
	};

	const boardWidth = horizontalBoardSize * cellSize;
	const boardHeight = verticalBoardSize * cellSize;

	const xOffset = (Dimensions.get('window').width - boardWidth) / 2;
	const yOffset = (Dimensions.get('window').height - boardHeight) / 24;

	for (let i = 0; i < verticalBoardSize; i++) {
		for (let j = 0; j < horizontalBoardSize; j++) {
			const cellContent = board[i][j];
			if (cellContent) {
				boardVisual.push(
					<Rect
						key={`${i}-${j}`}
						x={xOffset + j * cellSize}
						y={yOffset + i * cellSize}
						width={cellSize}
						height={cellSize}
						fill={fillColor(cellContent, i, j)}
						onPress={() => {
							!board[i][j]?.isCompleted && handleCellClick(i, j);
						}}
					/>,
					<Text
						key={`text-${i}-${j}`}
						x={xOffset + j * cellSize + cellSize / 2}
						y={yOffset + i * cellSize + cellSize / 2}
						textAnchor="middle"
						alignmentBaseline="middle"
						fontSize={20}
						stroke="black"
						onPress={() => {
							!board[i][j]?.isCompleted && handleCellClick(i, j);
						}}
					>
						{cellContent.letter}
					</Text>
				);
			}
		}
	}

	return <Svg>{boardVisual}</Svg>;
};

export default observer(WordSearchBoard);
