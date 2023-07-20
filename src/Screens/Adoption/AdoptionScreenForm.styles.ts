import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		flex: 1
	},
	input: {
		width: '100%',
		height: 50,
		marginTop: 2,
	},
	radioButton: {
		justifyContent: 'space-evenly',
		alignSelf: 'center',
		width: '58%',
		height: 50
	},
	labelRadioButton: {
		textAlign: 'left',
		width: '100%',
		alignSelf: 'center',
	},
	checkbox: {
		width: '25%'
	},
	viewList: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%'
	},
	text: {
		fontSize: 16,
		fontWeight: 'bold',
		marginLeft: 10
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
	comboItem: {
		backgroundColor: 'transparent',
		borderStartWidth: 0,
		borderEndWidth: 0,
		borderTopWidth: 0,
		borderRadius: 0,
		width: '100%',
		height: 60
	}
});
