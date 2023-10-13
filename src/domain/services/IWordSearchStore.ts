import { Statement } from '../models/InterfacesModels';

export interface IWordSearchStore {
	board: ({ letter: string; wordNumber: number; isCompleted: boolean } | null)[][];
	maxRows: number;
	maxCols: number;
	answers: Statement[];
	selectedCells: Set<string>;

	checkCompletedWord(_answer: Statement): boolean;
	completeWord(_answer: Statement): void;
	selectCell(_i: number, _j: number): void;
	deselectCell(_i: number, _j: number): void;
	isCellSelected(_i: number, _j: number): boolean;
	resetBoard(): void;
	setAnswers(_answers: Statement[]): void;
	isBoardWin: boolean;
}
