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
	photo: Photo;
}

export interface PublicationScreen {
	0: Publication[];
	1: number;
}
export interface AdoptionFilter extends Filter {
	location: string | undefined;
}
export interface Filter {
	species: string | undefined;
	date: Date | undefined;
}

export type ExperienceFilter = Filter;

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

export interface LoginCredentials {
	email: string;
	password: string;
}
export interface Token {
	access_token: string;
	token_type: string;
}

export interface Interaction {
	user_id: string;
}
export interface Photo {
	img_path: string;
}

export interface CommentsResults {
	0: Comment[];
	1: number;
}

export interface Comment extends Interaction {
	_id: string;
	user_photo: Photo;
	user_first_name: string;
	user_last_name: string;
	comment_text: string;
	comment_date: Date;
}

export type CommentText = Pick<Comment, 'comment_text'>;

export type Like = Interaction;

export interface AdoptionPublication extends Publication {
	pet_size: string;
	pet_breed: string;
	pet_age: number;
	pet_sex: boolean | undefined;
	pet_location: string;
	sterilized: boolean;
	vaccination_card: boolean;
	is_favorite: boolean;
}

export interface Publication {
	_id: string;
	user: User;
	description: string;
	publication_date: Date;
	photo: Photo;
	likes: [number, boolean] | Like[];
	species: string;
}
export type ExperiencePublication = Publication;

export interface Location {
	name: string;
	value: string;
}

export interface AddOrRemoveLikeProps {
	pub_id: string;
	is_adoption: boolean;
}

export interface AddCommentProps {
	pub_id: string;
	user_id: string;
	comment_text: string;
	comment_date: Date;
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
export interface OrganizationResults {
	0: Organization[];
	1: number;
}
export interface Organization {
	_id: string;
	name: string;
	description: string;
	photo: Photo;
	external_links: SocialMedia;
}
export interface SocialMedia {
	facebook: string;
	instagram: string;
	twitter: string;
	website: string;
}
