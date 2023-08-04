import { createStackNavigator} from '@react-navigation/stack';
import { QuizGameScreen } from '../Screens/Game/QuizGameScreen';
import { IconButton, useTheme } from 'react-native-paper';
import React from 'react';
import { set } from 'zod';

interface GameNavigationProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const Stack = createStackNavigator();
export function GameNavigationStack(
    { visible, setVisible }: GameNavigationProps
) {
	const theme = useTheme();
	return (
		<Stack.Navigator
        
			screenOptions={() =>({
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
                    icon='arrow-left-thick'
                    iconColor={theme.colors.secondary}
                    size={35}
                    {...props}
                    onPress={() => {setVisible(!visible)}}
                    />
                )
			}
            )
        }
		>
			<Stack.Screen name="Quiz Game" component={QuizGameScreen} options={{ title: 'Quiz Game' }} />
		</Stack.Navigator>
	);
}
