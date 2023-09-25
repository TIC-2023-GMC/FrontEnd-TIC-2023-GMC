import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	instructionText: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 10
	},
	input: {
		width: '100%',
		height: 50,
		marginVertical: 5,
		alignSelf: 'center',
		fontSize: 15
	},
	motivationInput: {
		height: 100
	},
	radioButton: {
		justifyContent: 'space-evenly',
		alignSelf: 'center',
		width: '58%',
		height: 50
	},
	radioButtonLabel: {
		textAlign: 'left',
		width: '100%',
		alignSelf: 'center'
	},
	radioGroupView: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%'
	},
	text: {
		fontSize: 16,
		fontWeight: '500',
		marginTop: 10,
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
	errorText: {
		marginBottom: 10
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
