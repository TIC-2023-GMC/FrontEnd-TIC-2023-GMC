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
export function getRemoveFavoriteAdoptionEndpoint() {
	return '/user/remove_favorite_adoption';
}
export function getAddFavoriteAdoptionEndpoint() {
	return '/user/add_favorite_adoption';
}

export function getMyPublicationsEndpoint({
	pageParam,
	pageSize,
	user_id
}: {
	pageParam: number;
	pageSize: number;
	user_id: string;
}) {
	return `/user/list_my_publications?page_number=${pageParam}&page_size=${pageSize}&user_id=${user_id}`;
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

export function getGamesEnpoint() {
	return `games/get_all_games`;
}
