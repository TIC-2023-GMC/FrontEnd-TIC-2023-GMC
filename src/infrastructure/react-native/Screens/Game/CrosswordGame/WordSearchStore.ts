import { makeAutoObservable } from 'mobx';
import { CrosswordAnswer } from '../../../../../domain/models/InterfacesModels';

export class WordSearchStore {
	board: ({ letter: string; wordNumber: number } | null)[][] = [];
	maxRows = 0;
	maxCols = 0;
	answers: CrosswordAnswer[] = [];
	selectedCells: Set<string> = new Set();

	constructor() {
		makeAutoObservable(this);
	}
	selectCell = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		this.selectedCells.add(cellKey);
	};
	deselectCell = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		this.selectedCells.delete(cellKey);
	};
	isCellSelected = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		return this.selectedCells.has(cellKey);
	};
	private generateBoard(): void {
		this.findSizeOfBoard();
		this.board = Array.from({ length: this.maxRows }, () =>
			Array.from({ length: this.maxCols }, () => {
				return { letter: this.getRandomLetter(), wordNumber: -1 };
			})
		);
		const cellOccupied = Array(this.maxRows)
			.fill(null)
			.map(() => Array(this.maxCols).fill(false));

		for (const answer of this.answers) {
			const startRow = answer.number - 1;
			const startCol = answer.number - 1;

			if (answer.type === 'horizontal') {
				for (let i = 0; i < answer.answer.length; i++) {
					// Comprobar si la celda ya está ocupada
					if (!cellOccupied[startRow][startCol + i]) {
						this.board[startRow][startCol + i] = {
							letter: answer.answer[i],
							wordNumber: answer.number
						};
						cellOccupied[startRow][startCol + i] = true;
						if (i === 0) {
							answer.position = [startRow, startCol];
						}
					}
				}
			} else {
				for (let i = 0; i < answer.answer.length; i++) {
					if (!cellOccupied[startRow + i][startCol]) {
						this.board[startRow + i][startCol] = {
							letter: answer.answer[i],
							wordNumber: answer.number
						};
						cellOccupied[startRow + i][startCol] = true;
						if (i === 0) {
							answer.position = [startRow, startCol];
						}
					}
				}
			}
		}
	}
	private getRandomLetter = () => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		return alphabet[Math.floor(Math.random() * alphabet.length)];
	};

	private findSizeOfBoard = () => {
		for (const answer of this.answers) {
			if (answer.type === 'horizontal') {
				this.maxCols = Math.max(this.maxCols, answer.answer.length + answer.number);
				this.maxRows = Math.max(this.maxRows, answer.number);
			} else {
				this.maxRows = Math.max(this.maxRows, answer.answer.length + answer.number - 1);
				this.maxCols = Math.max(this.maxCols, answer.number);
			}
		}
	};

	setAnswers = (answers: CrosswordAnswer[]) => {
		this.answers = answers;
		this.generateBoard();
	};
	get isBoardReady() {
		return this.maxRows > 0 && this.maxCols > 0;
	}
	get isBoardReadyToRender() {
		return this.isBoardReady && this.board.length > 0;
	}
	get isBoardReadyToPlay() {
		return this.isBoardReady && this.answers.length > 0;
	}
	get isBoardEmpty() {
		return this.answers.length === 0;
	}
}

const store = new WordSearchStore();
export default store;
