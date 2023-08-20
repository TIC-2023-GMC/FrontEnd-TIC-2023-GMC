import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	imgLogo: {
		width: 200,
		height: 137,
		marginTop: 20
	},
	cardContainer: {
		flexDirection: 'row',
		width: 335,
		height: 125,
		margin: 10,
		backgroundColor: '#F3FFE5',
		alignItems: 'center', 
		justifyContent: 'space-evenly',
		borderRadius: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	gameIcon:{
		width: 100,
		height: 100,
		margin: 10,
		borderRadius: 10,
	},
	sectionText:{
		width: '60%',
		alignItems: 'center',
	},
	gameTitle: {
		fontSize:20,
		paddingRight: 0,
		marginRight: 0,
		marginHorizontal: 0,
		alignItems: 'center',
		color: '#000',
		fontWeight: 'bold',
	},
	button: {
		width:100,
		height: 40,
		margin: 20,
		backgroundColor: '#4caf5066',
		buttonText:{
			fontSize: 20,
			margin: 0,
			padding: 0,
			color: '#fff'
		}
	}
});
