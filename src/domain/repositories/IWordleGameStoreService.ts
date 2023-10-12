export interface IWordleGameStoreService {
	word: string;
	guesses: string[];
	words: string[];
	attempts: number;
	currentGuess: number;
	won: boolean;
	lost: boolean;
	restartGame: () => void;
	init: (_data?: string[]) => void;
	submitGuess: () => void;
	handlerKeyup: (_key: string) => void;
	clearLastLetter: () => void;
	clearGuess: () => void;
	allGuesses: string[];
	exactGuesses: string[];
	inexactGuesses: string[];
	score: number;
}
