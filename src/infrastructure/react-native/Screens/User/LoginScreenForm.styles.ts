import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
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
		marginTop: 10
	},
	button: {
		width: '50%'
	},
	errorText: {
		marginBottom: 10
	}
});
