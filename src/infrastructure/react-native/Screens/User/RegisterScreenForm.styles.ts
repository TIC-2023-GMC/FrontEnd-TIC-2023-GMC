import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		marginTop: 50,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		gap: 10
	},
	text: {
		fontWeight: 'bold',
		marginVertical: 0,
		paddingVertical: 0,
		margin: 0
	},
	inputsView: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		marginVertical: 0,
		paddingVertical: 0
	},
	input: {
		width: '85%',
		marginVertical: 5,
		alignSelf: 'center',
		fontSize: 15
	},
	buttonView: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		marginVertical: 10
	},
	button: {
		width: '50%'
	},
	errorText: {
		marginBottom: 10
	},
	inputContainer: {
		position: 'relative',
		marginVertical: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},
	viewDropdown: {
		width: '75%',
		alignSelf: 'center',
		borderColor: '#797979',
		borderWidth: 1,
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	inputDropdown: {
		right: 0,
		borderWidth: 0,
		backgroundColor: 'transparent',
		width: '100%',
	},
	label: {
		fontSize: 12,
		position: 'absolute',
		top: -10,
		left: 12,
		paddingHorizontal: 5,
		zIndex: 9999
	}
});
