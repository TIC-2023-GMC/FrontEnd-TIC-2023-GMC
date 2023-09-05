import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
		flexDirection: 'column'
	},
	imgLogo: {
		width: '34%',
		height: '15%',
		top: 10,
		marginBottom: 25
	},
	cardContainer: {
		flexDirection: 'row',
		width: '90%',
		height: '20%',
		margin: 10,
		backgroundColor: '#F3FFE5',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		borderRadius: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4
	},
	gameIcon: {
		width: '40%',
		height: '80%',
		margin: 10,
		borderRadius: 10
	},
	sectionText: {
		width: '60%',
		alignItems: 'center'
	},
	gameTitle: {
		fontSize: 20,
		paddingRight: 0,
		marginRight: 0,
		marginHorizontal: 0,
		alignItems: 'center',
		color: '#000',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	button: {
		width: '70%',
		height: '27%',
		margin: 20,
		padding: 0,
		backgroundColor: '#4caf5066',
		buttonText: {
			fontSize: 20,
			margin: 0,
			padding: 0,
			color: '#fff'
		}
	}
});
