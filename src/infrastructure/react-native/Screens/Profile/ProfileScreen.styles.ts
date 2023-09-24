import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		flexDirection: 'column'
	},
	cardTitles: {
		borderTopEndRadius: 10,
		borderTopStartRadius: 10
	},
	profileContainer: {
		width: '90%',
		height: 350,
		marginTop: 25,
		flexDirection: 'column',
		justifyContent: 'space-between',
		backgroundColor: '#eef2e1'
	},
	aptitudeContainer: {
		height: 'auto',
		marginBottom: 10
	},
	basicInfoContainer: {
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignSelf: 'center'
	},
	userInfo: {
		width: '50%',
		flexDirection: 'column',
		height: '50%',
		justifyContent: 'center',
		alignSelf: 'center'
	},
	infoText: {
		fontSize: 20
	},
	contactTitleText: {
		alignSelf: 'center',
		fontSize: 16,
		fontWeight: 'bold'
	},
	emailView: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	emailText: {
		marginVertical: 10,
		marginLeft: 10,
		alignSelf: 'center'
	},
	aptitudeFieldView: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		width: '100%'
	},
	aptitudeTitleText: {
		fontSize: 20,
		alignSelf: 'center',
		fontWeight: 'bold',
		textAlignVertical: 'center'
	},
	aptitudeFieldText: {
		fontSize: 14,
		color: '#555'
	},
	aptitudeText: {
		fontSize: 16
	},
	profileButtonsView: {
		width: '100%',
		marginBottom: 20
	},
	button: {
		width: '80%',
		alignSelf: 'center',
		marginTop: 15,
		elevation: 20
	},
	snackbarStyle: {
		width: '90%',
		alignSelf: 'center',
		marginBottom: 20
	}
});
