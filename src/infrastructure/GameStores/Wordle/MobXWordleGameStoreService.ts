import { makeAutoObservable } from 'mobx';
import { IWordleGameStoreService } from '../../../domain/repositories/IWordleGameStoreService';

class MobXWordleGameStoreService implements IWordleGameStoreService {
	word = '';
	guesses = [] as string[];
	words = [] as string[];
	currentGuess = 0;
	score = 5;

	constructor() {
		makeAutoObservable(this);
	}

	get won() {
		if (this.word && this.guesses[this.currentGuess - 1])
			return this.word.toUpperCase() === this.guesses[this.currentGuess - 1].toUpperCase();
		return false;
	}

	get lost() {
		return this.currentGuess === 5;
	}

	init(_data?: string[]) {
		if (_data?.length) {
			this.words = _data;
			const words = _data;
			this.word = words[Math.floor(Math.random() * words.length)];
			this.guesses = new Array(this.word.length).fill('');
			this.currentGuess = 0;
		}
	}

	restartGame() {
		this.word = this.words[Math.floor(Math.random() * this.words.length)];
		this.guesses = new Array(this.word.length).fill('');
		this.currentGuess = 0;
		this.score = 5;
	}

	submitGuess() {
		this.currentGuess++;
		if (this.score > 0 && !this.won) this.score--;
	}
	get allGuesses() {
		return this.guesses.slice(0, this.currentGuess).join('').split('');
	}
	get exactGuesses() {
		return this.word.split('').filter((letter, i) => {
			return this.guesses
				.slice(0, this.currentGuess)
				.map((guess) => guess[i])
				.includes(letter);
		});
	}
	get inexactGuesses() {
		return this.word.split('').filter((letter) => {
			return this.allGuesses.includes(letter);
		});
	}

	get attempts() {
		return this.word.length - this.currentGuess;
	}

	handlerKeyup(key: string) {
		if (this.won || this.lost) return;
		if (key === 'Enter') this.submitGuess();
		if (this.guesses[this.currentGuess].length < this.word.length && key.match(/[A-z]/)) {
			this.guesses[this.currentGuess] += key;
		}
	}
	clearLastLetter() {
		if (this.guesses[this.currentGuess].length > 0) {
			this.guesses[this.currentGuess] = this.guesses[this.currentGuess].slice(
				0,
				this.guesses[this.currentGuess].length - 1
			);
		}
	}
	clearGuess() {
		this.guesses[this.currentGuess] = '';
	}
}

export default MobXWordleGameStoreService;
