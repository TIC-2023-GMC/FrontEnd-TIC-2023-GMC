import { NavigatorScreenParams } from '@react-navigation/native';

export type TabNavigationParamsList = {
	Adopciones: undefined;
	Experiencias: undefined;
	'Agregar Publicación': { screen: string };
	Organizaciones: undefined;
	AdoptionScreenForm: undefined;
	ExperienceScreenForm: undefined;
	Perfil: NavigatorScreenParams<ProfileStackParamsList>;
};

export type ProfileStackParamsList = {
	'Perfil de Usuarios': { userId: string };
	'Editar Perfil': undefined;
	'Mis Publicaciones': undefined;
	Favoritos: undefined;
};

export type GameTabNavigation = {
	'Hangman Game': undefined;
	'Search Words Game': undefined;
	'Quiz Game': undefined;
	'Menu Games': undefined;
};
