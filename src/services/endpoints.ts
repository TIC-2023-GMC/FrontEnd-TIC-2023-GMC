import { AdoptionFilter, ExperienceFilter, User } from '../models/InterfacesModels';

export function getListAdoptionsEndpoint({
	pageParam,
	pageSize,
	filter,
	newDate
}: {
	pageParam: number;
	pageSize: number;
	filter: AdoptionFilter;
	newDate: Date | undefined;
}) {
	return `adoptions/list?page_number=${pageParam}&page_size=${pageSize}${
		filter?.species ? '&species=' + filter.species : ''
	}${filter?.date ? '&date=' + newDate?.toISOString() : ''}${
		filter?.location ? '&location=' + filter?.location : ''
	}`;
}
//
export function getListExperiencesEnpoint({
	pageParam,
	pageSize,
	filter,
	newDate
}: {
	pageParam: number;
	pageSize: number;
	filter: ExperienceFilter;
	newDate: Date | undefined;
}) {
	return `experiences/list?page_number=${pageParam}&page_size=${pageSize}${
		filter?.species ? '&species=' + filter.species : ''
	}${filter?.date ? '&date=' + newDate?.toISOString() : ''}`;
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

export function getAddLikeEndpoint({
	userId,
	pubId,
	isAdoption
}: {
	userId: string;
	pubId: string;
	isAdoption: boolean;
}) {
	return `/like/add_like?user_id=${userId}&pub_id=${pubId}&is_adoption=${isAdoption}`;
}

export function getRemoveLikeEndpoint({
	userId,
	pubId,
	isAdoption
}: {
	userId: string;
	pubId: string;
	isAdoption: boolean;
}) {
	return `/like/remove_like?user_id=${userId}&pub_id=${pubId}&is_adoption=${isAdoption}`;
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
	return `/match/leaderboard?user_id=${user._id}`;
}
export function getQuizGameByUserEndpoint(user: User) {
	return `match/quiz_game?user_id=${user._id}`;
}
export function getQuizGameEndpoint() {
	return `match/quiz_game`;
}
export function getUpdateUserEndpoint() {
	return '/user/update_user';
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

export function getUserByIdEndpoint(id: string) {
	return `user/get_by_id?_id=${id}`;
}

export function getGamesEnpoint() {
	return `game/get_games`;
}
