export interface User {
	first_name: string;
	last_name: string;
	mobile_phone: string;
	neighborhood: string;
	email: string;
	password: string;
	num_previous_pets: number;
	num_current_pets: number;
	outdoor_hours: number;
	house_space: number;
	has_yard: boolean;
	main_pet_food: string;
	pet_expenses: number;
	motivation: string;
	favorite_adoption_publications: string[];
	photo: {
		_id: string;
		img_path: string;
	};
}
export interface Interaction {
	user: User;
}
export interface Photo {
	_id: string;
	img_path: string;
}
export interface Comment extends Interaction {
	_id: string;
	comment_text: string;
	comment_date: string;
}
export interface Like extends Interaction {
	_id: string;
}

export interface AdoptionPublication {
	_id: string;
	user: User;
	description: string;
	publication_date: string;
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
export interface Answer{
	answer_text: string;
	is_correct: boolean;
}

export interface Question {
	question_text: string;
	answers: Answer[];
}

export interface GameQuiz{
	_id: string;
	user_id: string;
	game_name: string;
	game_description: string;
	game_image: Photo;
	game_category: string;
	game_score: number;
	game_questions: Question[];
	game_time: number;
}

export interface UserScore{
	user_first_name: string;
	user_last_name: string;
	user_photo: Photo;
	game_score: number;
	game_time: number;
}

export interface UserPosition{
	position: number;
	user: UserScore;
}

export interface LeaderBoard{ 
	0: UserPosition[],
	1: number
}