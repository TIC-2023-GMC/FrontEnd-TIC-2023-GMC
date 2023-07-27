import { View, Text, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

//función que tomes las pregunta y las opciones de la api
const theme = useTheme();
export function QuizzisGameScreen() {
	const question = ''; //halar de la api
	const options = ['', '', '', '']; //halar de la api
	return (
		<View>
			<Card>
				<Text>{question}</Text>
			</Card>
         
            <Card>{options[0]}</Card>
            <Card>{options[1]}</Card>
            <Card>{options[2]}</Card>
            <Card>{options[3]}</Card>
		</View>
	);
}

const styles = StyleSheet.create({ 
    questionCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        width: 384,
        height: 234,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        marginBottom: 50
    }
});
