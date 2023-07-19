import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},

	viewList: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		width:'100%'
	},
	listItems: {
		width: '100%',
		justifyContent: 'center',
		alignContent: 'center'
	},
	buttonView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		margin: 10
	},
	button: {
		width: '45%'
	},
	iconButton: {
		alignSelf: 'center',
		justifyContent: 'space-around',
		margin: 0,
		height: 30
	},
	checkbox:{
		width:'25%',
	}

});
