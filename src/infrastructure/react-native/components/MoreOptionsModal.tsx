import * as React from 'react';
import { useState } from 'react';
import { Dimensions, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, IconButton, List, Modal, Portal, Snackbar, useTheme } from 'react-native-paper';
import { AdoptionPublication } from '../../../domain/models/InterfacesModels';

const deviceHeight = Dimensions.get('window').height;

interface MoreOptionsModalProps {
	publication: AdoptionPublication;
	modalVisible: boolean;
	navBarHeight: number;
	handleModalVisible: () => void;
}

const MoreOptionsModal = ({
	publication,
	modalVisible,
	navBarHeight,
	handleModalVisible
}: MoreOptionsModalProps) => {
	const theme = useTheme();
	const [snackbarVisible, setSnackbarVisible] = useState(false);

	return (
		<Portal>
			<Modal
				visible={modalVisible}
				onDismiss={handleModalVisible}
				theme={{ ...theme }}
				contentContainerStyle={{
					backgroundColor: theme.colors.secondary,
					justifyContent: 'flex-start',
					alignContent: 'center',
					height: 150,
					borderTopEndRadius: 20,
					borderTopStartRadius: 20,
					transform: [{ translateY: deviceHeight / 2 - navBarHeight - 75 }]
				}}
			>
				<TouchableOpacity>
					<IconButton
						icon="chevron-down"
						style={styles.iconButton}
						iconColor={theme.colors.tertiary}
						size={30}
						onTouchEnd={handleModalVisible}
					/>
				</TouchableOpacity>

				<Divider />
				<TouchableOpacity
					style={styles.viewList}
					onPress={() => {
						Linking.openURL(`tel:${publication.user.mobile_phone}`);
					}}
				>
					<List.Item
						style={styles.list}
						titleStyle={{ fontWeight: 'bold' }}
						title={`Llamar a ${publication.user.first_name}`}
						left={(props) => (
							<IconButton
								{...props}
								style={{ margin: 0, padding: 0 }}
								icon={'phone'}
								iconColor={theme.colors.primary}
								size={50}
							/>
						)}
					/>
				</TouchableOpacity>

				<Divider />
				<TouchableOpacity
					style={styles.viewList}
					onPress={() => {
						Linking.canOpenURL(`whatsapp://send?phone=${publication.user.mobile_phone}`).then(
							(supported) => {
								if (supported) {
									Linking.openURL(`whatsapp://send?phone=${publication.user.mobile_phone}`);
								} else {
									setSnackbarVisible(true);
								}
							}
						);
					}}
				>
					<List.Item
						style={styles.list}
						titleStyle={{ fontWeight: 'bold' }}
						title={`Enviar mensaje a ${publication.user.first_name}`}
						left={(props) => (
							<IconButton
								{...props}
								style={{ margin: 0, padding: 0 }}
								icon={'whatsapp'}
								iconColor={theme.colors.primary}
								size={50}
							/>
						)}
					/>
				</TouchableOpacity>
			</Modal>
			<Snackbar
				onIconPress={() => setSnackbarVisible(false)}
				style={styles.snackbarStyle}
				duration={3000}
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
			>
				Error al abrir Whatsapp...
			</Snackbar>
		</Portal>
	);
};
const styles = StyleSheet.create({
	viewList: {
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'
	},
	downButton: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: '20%'
	},
	list: {
		justifyContent: 'center',
		height: 60,
		width: '90%',
		fontWeight: 'bold',
		paddingRight: 0
	},
	iconButton: {
		width: '100%',
		alignSelf: 'center',
		justifyContent: 'space-around',
		margin: 0,
		height: 30
	},
	snackbarStyle: {
		width: '90%',
		alignSelf: 'center',
		marginBottom: 20,
		justifySelf: 'center'
	}
});

export default MoreOptionsModal;
