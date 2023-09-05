import React from 'react';
import { Button } from 'react-native-paper';
import { styles } from './MenuGameScreen.styles';
import { Image, Text, View } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Game } from '../../models/InterfacesModels';
import { get } from '../../services/api';
import { getGamesEndpoint } from '../../services/endpoints';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { GameTabNavigation } from '../../models/types';

const imgLogo = {
	uri: 'https://firebasestorage.googleapis.com/v0/b/pawq-fc6dc.appspot.com/o/logo_a_jugar.png?alt=media&token=fd695e63-f0f5-467e-a95f-e481b7f1c705'
};

export function MenuGameScreen() {
	const navigation = useNavigation<NavigationProp<GameTabNavigation>>();
	const [games, setGames] = useState<Game[]>();

	useQuery({
		queryKey: ['listGames'],
		queryFn: async () => {
			const response = await get<Game[]>(getGamesEndpoint());
			return response.data;
		},
		onSuccess: (data: Game[]) => {
			setGames(data);
		}
	});
	return (
		<View style={styles.container}>
			<Image source={imgLogo} resizeMode="contain" style={styles.imgLogo} />
			{games?.map((opcion, index) => (
				<View key={index} style={styles.cardContainer}>
					<Image source={{ uri: opcion.game_image.img_path }} style={styles.gameIcon} />
					<View style={styles.sectionText}>
						<Text style={styles.gameTitle}>{opcion.game_name}</Text>
						<Button
							style={styles.button}
							labelStyle={styles.buttonText}
							contentStyle={styles.buttonContent}
							mode="elevated"
							onPress={() => {
								switch (opcion.game_name) {
									case 'Leyes y Sanciones':
										navigation.navigate('Hangman Game');
										break;
									case 'Cuidado Responsable':
										navigation.navigate('Search Words Game');
										break;
									case 'Evaluándome':
										navigation.navigate('Quiz Game');
										break;
								}
							}}
						>
							Jugar
						</Button>
					</View>
				</View>
			))}
		</View>
	);
}
