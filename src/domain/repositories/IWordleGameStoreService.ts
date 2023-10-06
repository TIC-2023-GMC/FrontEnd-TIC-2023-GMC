export interface IWordleGameStoreService {
	word: string;
	guesses: string[];
	currentGuess: number;
	won: boolean;
	lost: boolean;
	init: (_data?: string[]) => void;
	submitGuess: () => void;
	handlerKeyup: (_key: string) => void;
	clearLastLetter: () => void;
	clearGuess: () => void;
	allGuesses: string[];
	exactGuesses: string[];
	inexactGuesses: string[];
}
