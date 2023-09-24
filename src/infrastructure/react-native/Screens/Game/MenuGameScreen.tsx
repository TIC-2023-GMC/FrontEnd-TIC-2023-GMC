import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useQueryGames } from '../../../../application/hooks';
import { GameTabNavigation } from '../../../../domain/types/types';
import { styles } from './MenuGameScreen.styles';

const imgLogo = {
	uri: 'https://firebasestorage.googleapis.com/v0/b/pawq-fc6dc.appspot.com/o/logo_a_jugar.png?alt=media&token=fd695e63-f0f5-467e-a95f-e481b7f1c705'
};

export function MenuGameScreen() {
	const navigation = useNavigation<NavigationProp<GameTabNavigation>>();
	const { loading, games } = useQueryGames();
	return loading ? (
		<ActivityIndicator animating={true} size={'large'} style={styles.activityIndicator} />
	) : (
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
