export interface User {
	_id?: string;
	first_name: string;
	last_name: string;
	mobile_phone: string;
	neighborhood: string;
	birth_date: Date;
	email: string;
	password: string;
	num_previous_pets: number;
	num_current_pets: number;
	outdoor_hours: number;
	house_space: number;
	has_yard: boolean | undefined;
	main_pet_food: string;
	pet_expenses: number;
	motivation: string;
	favorite_adoption_publications: string[];
	photo: Photo;
}
export interface AdoptionFilter {
	species: string | undefined;
	date: Date | undefined;
	location: string | undefined;
}

export interface ExperienceFilter {
	species: string | undefined;
	date: Date | undefined;
}

export type UserAptitude = Pick<
	User,
	| 'num_previous_pets'
	| 'num_current_pets'
	| 'outdoor_hours'
	| 'house_space'
	| 'has_yard'
	| 'main_pet_food'
	| 'pet_expenses'
	| 'motivation'
>;

export interface Interaction {
	user_id: string;
}
export interface Photo {
	img_path: string;
}
export interface Comment extends Interaction {
	_id: string;
	user_photo: Photo;
	user_first_name: string;
	user_last_name: string;
	comment_text: string;
	comment_date: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Like extends Interaction {}

export interface AdoptionPublication {
	_id: string;
	user: User;
	description: string;
	publication_date: Date;
	photo: Photo;
	likes: Like[];
	comments: Comment[];
	species: string;
	pet_size: string;
	pet_breed: string;
	pet_age: number;
	pet_sex: boolean | undefined;
	pet_location: string;
	sterilized: boolean;
	vaccination_card: boolean;
}
export interface ExperiencePublication {
	_id: string;
	user: User;
	description: string;
	publication_date: Date;
	photo: Photo;
	likes: Like[];
	comments: Comment[];
	species: string;
}

export interface Location {
	name: string;
	value: string;
}
export interface SaveOrRemoveFavoriteProps {
	user_id: string;
	pub_id: string;
}

export interface AddOrRemoveLikeProps {
	user_id: string;
	pub_id: string;
	is_adoption: boolean;
}

//Game Section
export interface Game {
	game_name: string;
	game_category: string;
	game_description: string;
	game_image: Photo;
}

export interface Answer {
	answer_text: string;
	is_correct: boolean;
}

export interface Question {
	question_text: string;
	answers: Answer[];
}

export interface QuizGameMatch {
	_id: string;
	user_id: string;
	match_name: string;
	match_game_score: number;
	match_game_time: number;
	match_game_onboarding: string;
	match_game_questions: Question[];
}

export interface UserScore {
	user_first_name: string;
	user_last_name: string;
	user_photo: Photo;
	match_game_score: number;
	match_game_time: number;
}

export interface UserPosition {
	position: number;
	user: UserScore;
}
export interface LeaderBoard {
	0: UserPosition[];
	1: number;
}
