import { observer } from 'mobx-react';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Rect, Text } from 'react-native-svg';
import CrossGameStore from '../Screens/Game/CrosswordGame/WordSearchStore';

const WordSearchBoard = ({ store }: { store: typeof CrossGameStore }) => {
	const {
		maxCols: verticalBoardSize,
		maxRows: horizontalBoardSize,
		board,
		isCellSelected,
		deselectCell,
		selectCell
	} = store;
	const cellSize = 25;
	const theme = useTheme();

	const boardVisual = [];
	const fillColor = (cellContent: { letter: string; wordNumber: number }, i: number, j: number) =>
		isCellSelected(i, j)
			? theme.colors.tertiary
			: cellContent.wordNumber !== -1
			? theme.colors.primary
			: 'white';
	const handleCellClick = (i: number, j: number) => {
		if (isCellSelected(i, j)) {
			deselectCell(i, j);
		} else {
			selectCell(i, j);
		}
	};

	for (let i = 0; i < verticalBoardSize; i++) {
		for (let j = 0; j < horizontalBoardSize; j++) {
			const cellContent = board[i][j];
			if (cellContent) {
				boardVisual.push(
					<Rect
						key={`${i}-${j}`}
						x={j * cellSize}
						y={i * cellSize}
						width={cellSize}
						height={cellSize}
						fill={fillColor(cellContent, i, j)}
						stroke="black"
						strokeWidth="1"
						onPress={() => handleCellClick(i, j)}
					/>,
					<Text
						key={`text-${i}-${j}`}
						x={j * cellSize + cellSize / 2}
						y={i * cellSize + cellSize / 2}
						textAnchor="middle"
						alignmentBaseline="middle"
						fontSize={20}
						stroke="black"
					>
						{cellContent.letter}
					</Text>
				);
			}
		}
	}

	return boardVisual;
};

export default observer(WordSearchBoard);
