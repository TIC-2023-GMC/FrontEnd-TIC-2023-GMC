import { AdoptionFilter, ExperienceFilter } from '../../domain/models/InterfacesModels';

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

export function getAddLikeEndpoint() {
	return '/like/add_like';
}

export function getRemoveLikeEndpoint() {
	return '/like/remove_like';
}

export function getRemoveFavoriteAdoptionEndpoint() {
	return '/user/remove_favorite_adoption';
}

export function getAddFavoriteAdoptionEndpoint() {
	return '/user/add_favorite_adoption';
}

export function getMyPublicationsEndpoint({
	pageParam,
	pageSize
}: {
	pageParam: number;
	pageSize: number;
}) {
	return `/user/list_my_publications?page_number=${pageParam}&page_size=${pageSize}`;
}

export function getLeaderBoardEndpoint() {
	return '/match/leaderboard';
}
export function getQuizGameByUserEndpoint() {
	return 'match/quiz_game';
}
export function getQuizGameEndpoint() {
	return 'match/quiz_game';
}
export function getUpdateUserEndpoint() {
	return '/user/update_user';
}

export function getAddAdoptionEndpoint() {
	return 'adoptions/add';
}

export function getAddExperienceEndpoint() {
	return 'experiences/add';
}

export function getParishEndpoint() {
	return 'parish/get_all';
}

export function getUserByIdEndpoint(id: string) {
	return `user/get_by_id?_id=${id}`;
}

export function getGamesEndpoint() {
	return 'game/get_games';
}

export function getListCommentsEndpoint({
	pubId,
	pageParam,
	pageSize
}: {
	pubId: string;
	pageParam: number;
	pageSize: number;
}) {
	return `comments/list_comments?page_number=${pageParam}&page_size=${pageSize}&pub_id=${pubId}`;
}

export function getUserMeEndpoint() {
	return 'user/user_me';
}
export function getLoginEndpoint() {
	return 'user/token';
}

export function getAddCommentEndpoint() {
	return 'user/token';
}

export function getWordleGameEndpoint() {
	return 'wordle/get_wordle_match';
}

export function putWordleGameEndpoint() {
	return 'wordle/put_wordle_match';
}