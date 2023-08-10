import { AdoptionFilter, ExperienceFilter, User } from '../models/InterfacesModels';

export function getListAdoptionsEndpoint({
	pageParam,
	pageSize,
	filter,
	new_date
}: {
	pageParam: number;
	pageSize: number;
	filter: AdoptionFilter;
	new_date: Date | undefined;
}) {
	return `adoptions/list?page_number=${pageParam}&page_size=${pageSize}${
		filter?.species ? '&species=' + filter.species : ''
	}${filter?.date ? '&date=' + new_date?.toISOString() : ''}${
		filter?.location ? '&location=' + filter?.location : ''
	}`;
}
//
export function getListExperiencesEnpoint({
	pageParam,
	pageSize,
	filter,
	new_date
}: {
	pageParam: number;
	pageSize: number;
	filter: ExperienceFilter;
	new_date: Date | undefined;
}) {
	return `experiences/list?page_number=${pageParam}&page_size=${pageSize}${
		filter?.species ? '&species=' + filter.species : ''
	}${filter?.date ? '&date=' + new_date?.toISOString() : ''}`;
}

export function getListFavoritesAdoptionsEndpoint({
	pageParam,
	pageSize
}: {
	pageParam: number;
	pageSize: number;
}) {
	return `/user/list_favorite_adoptions?page_number=${pageParam}&page_size=${pageSize}`;
}

export function getLeaderBoardEndpoint(user: User) {
	return `/game/leaderboard?user_id=${user._id}`;
}
export function getQuizGameByUserEndpoint(user: User) {
	return `game/quiz_game?user_id=${user._id}`;
}
export function getQuizGameEndpoint() {
	return `game/quiz_game`;
}

export function getAddAdoptionEndpoint() {
	return `adoptions/add`;
}

export function getAddExperienceEndpoint() {
	return `experiences/add`;
}

export function getParishEndpoint() {
	return `parish/get_all`;
}
