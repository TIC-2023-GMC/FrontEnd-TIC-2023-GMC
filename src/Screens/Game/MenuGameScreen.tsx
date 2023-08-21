import React from 'react';
import { Button } from 'react-native-paper';
import { styles } from './MenuGameScreen.styles';
import { ImageBackground, Image, Text, View } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Game } from '../../models/InterfacesModels';
import { get } from '../../services/api';
import { getGamesEnpoint } from '../../services/endpoints';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { GameTabNavigation } from '../../models/types';

const imgBackground = {
	uri: 'https://firebasestorage.googleapis.com/v0/b/pawq-fc6dc.appspot.com/o/Game_Menu.png?alt=media&token=d178bc66-6db3-4f39-a80c-baf296ee424c'
};
const imgLogo = {
	uri: 'https://firebasestorage.googleapis.com/v0/b/pawq-fc6dc.appspot.com/o/logo_a_jugar.png?alt=media&token=7c812384-d538-47fd-88ad-1bcf0dd8bac0'
};

export function MenuGameScreen() {
	const navigation = useNavigation<NavigationProp<GameTabNavigation>>();
	const [games, setGames] = useState<Game[]>();

	useQuery({
		queryKey: ['listGames'],
		queryFn: async () => {
			const response = await get<Game[]>(getGamesEnpoint());
			return response.data;
		},
		onSuccess: (data: Game[]) => {
			setGames(data);
		}
	});

	return (
		<ImageBackground source={imgBackground} resizeMode="cover" style={styles.container}>
			<Image source={imgLogo} resizeMode="cover" style={styles.imgLogo} />
			{games?.map((opcion, index) => (
				<View key={index} style={styles.cardContainer}>
					<Image source={{ uri: opcion.game_image.img_path }} style={styles.gameIcon} />
					<View style={styles.sectionText}>
						<Text style={styles.gameTitle}>{opcion.game_name}</Text>
						<Button
							style={styles.button}
							mode="elevated"
							onPress={() => {
								switch (opcion.game_name) {
									case 'Leyes y Sanciones':
										navigation.navigate('Hangman Game');
										break;
									case 'Cuidado Responsable':
										navigation.navigate('Search Words Game');
										break;
									case 'Quiz':
										navigation.navigate('Quiz Game');
										break;
								}
							}}
						>
							<Text style={styles.button.buttonText}>Jugar</Text>
						</Button>
					</View>
				</View>
			))}
		</ImageBackground>
	);
}
