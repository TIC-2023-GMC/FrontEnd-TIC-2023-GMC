import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	section: {
		flex: 1,
		flexDirection: 'column',
		marginBottom: 65
	},
	activityIndicator: {
		margin: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
	snackbarStyle: {
		width: '90%',
		alignSelf: 'center',
		marginBottom: 20
	}
});
