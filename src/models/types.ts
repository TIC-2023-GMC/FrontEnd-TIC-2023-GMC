import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp,   } from '@react-navigation/native-stack';


export type TabNavigationParamsList = {
	Adopciones: undefined;
	Experiencias: undefined;
	'Agregar Publicación': { screen: string };
	Organizaciones: undefined;
	Perfil: undefined;
	AdoptionScreenForm: undefined;
	ExperienceScreenForm: undefined;
	'Mis Publicaciones': undefined;
	Favoritos: undefined;
	'Editar Perfil': undefined;
	'Perfil de Usuario': { screen: string, params: { userId: string } };
};

export type ProfileParamsList = {
	'PerfilUsuario': { userId: string };
}

export type ProfileStackNavProps<T extends keyof ProfileParamsList> = {
	navigation: NativeStackNavigationProp<ProfileParamsList, T>;
	route: RouteProp<ProfileParamsList, T>;
}

export type HomeStackNavProps<T extends keyof TabNavigationParamsList> = {
	navigation: NativeStackNavigationProp<TabNavigationParamsList, T>;
	route: RouteProp<TabNavigationParamsList, T>;
};