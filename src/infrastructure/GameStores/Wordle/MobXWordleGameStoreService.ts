import { action, computed, makeObservable, observable } from 'mobx';
import { IWordleGameStoreService } from '../../../domain/repositories/IWordleGameStoreService';
import testWords from './testWords.json';

class MobXWordleGameStoreService implements IWordleGameStoreService {
	word = '';
	guesses = [] as string[];
	currentGuess = 0;

	constructor() {
		makeObservable(this, {
			word: observable,
			guesses: observable,
			currentGuess: observable,
			won: computed,
			lost: computed,
			init: action,
			submitGuess: action,
			handlerKeyup: action,
			clearLastLetter: action,
			clearGuess: action
		});
	}

	get won() {
		return this.word === this.guesses[this.currentGuess - 1];
	}

	get lost() {
		return this.currentGuess === 5;
	}

	init(_data?: string[]) {
		const words = _data ?? testWords;
		this.word = words[Math.floor(Math.random() * words.length)];

		this.guesses = new Array(this.word.length).fill('');
		this.currentGuess = 0;
	}

	submitGuess() {
		this.currentGuess++;
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

	handlerKeyup(key: string) {
		if (this.won || this.lost) return;
		if (key === 'Enter') this.submitGuess();
		if (this.guesses[this.currentGuess].length < 5 && key.match(/[A-z]/)) {
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
