import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import HangmanGameScreen from '../Screens/Game/HangmanGame/HangmanGameScreen';
import { MenuGameScreen } from '../Screens/Game/MenuGameScreen';
import { QuizGameScreen } from '../Screens/Game/QuizGame/QuizGameScreen';
import SearchWordsScreen from '../Screens/Game/SearchWordsGame/SearchWordsGame';

interface GameNavigationProps {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const Stack = createStackNavigator();
export function GameNavigationStack({ visible, setVisible }: GameNavigationProps) {
	const theme = useTheme();
	return (
		<Stack.Navigator
			screenOptions={() => ({
				headerStyle: {
					backgroundColor: theme.colors.primary
				},
				headerTitleStyle: {
					color: theme.colors.secondary,
					fontWeight: 'bold',
					fontSize: 24
				},
				headerTitleAlign: 'center',
				headerLeft: (props) => (
					<IconButton
						icon="arrow-left-thick"
						iconColor={theme.colors.secondary}
						size={35}
						{...props}
					/>
				)
			})}
		>
			<Stack.Screen
				name="Menu Game"
				options={{
					title: 'Aprende Jugando',
					headerLeft: (props) => (
						<IconButton
							icon="arrow-left-thick"
							iconColor={theme.colors.secondary}
							size={35}
							{...props}
							onPress={() => {
								setVisible(!visible);
							}}
						/>
					)
				}}
				component={MenuGameScreen}
			/>
			<Stack.Screen
				name="Hangman Game"
				options={{ title: 'Leyes y Sanciones' }}
				component={HangmanGameScreen}
			/>
			<Stack.Screen
				name="Search Words Game"
				options={{ title: 'Cuidado Responsable' }}
				component={SearchWordsScreen}
			/>
			<Stack.Screen
				component={QuizGameScreen}
				name="Quiz Game"
				options={{ title: 'Leyes y Sanciones' }}
			/>
		</Stack.Navigator>
	);
}
