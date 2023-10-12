import { makeAutoObservable } from 'mobx';
import { Statement } from '../../domain/models/InterfacesModels';
import { IWordSearchStore } from '../../domain/services/IWordSearchStore';

export class MobxWordSearchStore implements IWordSearchStore {
	board: ({ letter: string; wordNumber: number; isCompleted: boolean } | null)[][] = [];
	maxRows = 0;
	maxCols = 0;
	answers: Statement[] = [];
	selectedCells: Set<string> = new Set();

	constructor() {
		makeAutoObservable(this);
	}

	checkCompletedWord = (answer: Statement) => {
		if (answer === undefined || answer === null) {
			return false;
		}
		if (answer.orientation === 'horizontal') {
			for (let i = 0; i < answer.answer.length; i++) {
				const pos = answer.position as [number, number];
				if (!this.isCellSelected(pos[0], pos[1] + i)) {
					return false;
				}
			}
		} else {
			for (let i = 0; i < answer.answer.length; i++) {
				const pos = answer.position as [number, number];
				if (!this.isCellSelected(pos[0] + i, pos[1])) {
					return false;
				}
			}
		}
		return true;
	};

	completeWord = (answer: Statement) => {
		if (answer.orientation === 'horizontal') {
			for (let i = 0; i < answer.answer.length; i++) {
				const pos = answer.position as [number, number];

				this.board[pos[0]][pos[1] + i]!.isCompleted = true;
			}
		} else {
			for (let i = 0; i < answer.answer.length; i++) {
				const pos = answer.position as [number, number];
				this.board[pos[0] + i][pos[1]]!.isCompleted = true;
			}
		}
	};

	selectCell = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		this.selectedCells.add(cellKey);

		const answer = this.answers.find((a) => {
			if (a.position !== undefined) {
				if (a.orientation === 'horizontal') {
					return a.position[0] === i && j >= a.position[1] && j < a.position[1] + a.answer.length;
				} else {
					return a.position[1] === j && i >= a.position[0] && i < a.position[0] + a.answer.length;
				}
			}
		});

		if (answer) {
			let wordCompleted = true;
			for (let index = 0; index < answer.answer.length; index++) {
				const pos = answer.position as [number, number];
				if (answer.orientation === 'horizontal') {
					if (!this.isCellSelected(i, pos[1] + index)) {
						wordCompleted = false;
					}
				} else {
					if (!this.isCellSelected(pos[0] + index, j)) {
						wordCompleted = false;
					}
				}
			}

			if (wordCompleted) {
				this.completeWord(answer);
			}
		}
	};

	deselectCell = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		this.selectedCells.delete(cellKey);
	};

	isCellSelected = (i: number, j: number) => {
		const cellKey = `${i}-${j}`;
		return this.selectedCells.has(cellKey);
	};

	resetBoard(): void {
		this.selectedCells = new Set();
		this.answers = [];
		this.board = [];
		this.maxRows = 0;
		this.maxCols = 0;
	}

	private generateBoard(): void {
		this.findSizeOfBoard();
		this.board = Array.from({ length: this.maxRows }, () =>
			Array.from({ length: this.maxCols }, () => {
				return { letter: this.getRandomLetter(), wordNumber: -1, isCompleted: false };
			})
		);

		const cellOccupied = Array(this.maxRows)
			.fill(null)
			.map(() => Array(this.maxCols).fill(false));

		for (const answer of this.answers) {
			const startRow = answer.number - 1,
				startCol = answer.number - 1;

			if (answer.orientation === 'horizontal') {
				for (let i = 0; i < answer.answer.length; i++) {
					if (!cellOccupied[startRow][startCol + i]) {
						this.board[startRow][startCol + i] = {
							letter: answer.answer[i],
							wordNumber: answer.number,
							isCompleted: false
						};
						cellOccupied[startRow][startCol + i] = true;
						if (i === 0) {
							answer.position = [startRow, startCol];
						}
					} else {
						break;
					}
				}
			} else {
				for (let i = 0; i < answer.answer.length; i++) {
					if (!cellOccupied[startRow + i][startCol]) {
						this.board[startRow + i][startCol] = {
							letter: answer.answer[i],
							wordNumber: answer.number,
							isCompleted: false
						};
						cellOccupied[startRow + i][startCol] = true;
						if (i === 0) {
							answer.position = [startRow, startCol];
						}
					} else {
						break;
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
			if (answer.orientation === 'horizontal') {
				this.maxCols = Math.max(this.maxCols, answer.answer.length + answer.number);
				this.maxRows = Math.max(this.maxRows, answer.number);
			} else {
				this.maxRows = Math.max(this.maxRows, answer.answer.length + answer.number - 1);
				this.maxCols = Math.max(this.maxCols, answer.number);
			}
		}
	};

	setAnswers = (answers: Statement[]) => {
		const updatedStatements = answers.map((statement) => ({
			...statement,
			answer: statement.answer.toUpperCase()
		}));

		this.resetBoard();

		this.answers = updatedStatements;
		this.generateBoard();
	};

	get isBoardWin() {
		if (this.answers.length === 0) {
			return false;
		} else {
			return this.answers.every((answer) => this.checkCompletedWord(answer));
		}
	}
}

const store = new MobxWordSearchStore();
export default store;
