/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Portal, Modal, List, IconButton, Divider } from 'react-native-paper';
import { AdoptionPublication } from '../models/InterfacesModels';

const deviceHeight = Dimensions.get('window').height;

interface MoreOptionsModalProps {
	publication: AdoptionPublication;
	visible: boolean;
	navBarHeight: number;
	handlerVisible: () => void;
	onSaveAsFavorite?: () => void;
	onRemoveFromFavorites: () => void;
	checkedFavorite?: boolean;
}

const MoreOptionsModal = ({
	publication,
	visible,
	navBarHeight,
	handlerVisible,
	onSaveAsFavorite,
	onRemoveFromFavorites,
	checkedFavorite
}: MoreOptionsModalProps) => {
	const theme = useTheme();

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handlerVisible}
				theme={{ ...theme }}
				contentContainerStyle={{
					backgroundColor: theme.colors.secondary,
					justifyContent: 'flex-start',
					alignContent: 'center',
					height: 270,
					borderTopEndRadius: 20,
					borderTopStartRadius: 20,
					transform: [{ translateY: deviceHeight / 2 - navBarHeight - 135 }]
				}}
			>
				<TouchableOpacity>
					<IconButton
						icon="chevron-down"
						style={styles.iconButton}
						iconColor={theme.colors.tertiary}
						size={30}
						onTouchEnd={handlerVisible}
					/>
				</TouchableOpacity>

				<Divider />
				<TouchableOpacity style={styles.viewList}>
					<List.Item
						style={styles.list}
						titleStyle={{ fontWeight: 'bold' }}
						title={!checkedFavorite ? 'Guardar en favoritos' : 'Eliminar de favoritos'}
						onPress={() => {
							!checkedFavorite
								? onSaveAsFavorite
									? onSaveAsFavorite()
									: null
								: onRemoveFromFavorites();
						}}
						left={(props) => (
							<IconButton
								{...props}
								style={{ margin: 0, padding: 0 }}
								icon={`bookmark${!checkedFavorite ? '-outline' : ''}`}
								iconColor={theme.colors.primary}
								size={50}
							/>
						)}
					/>
				</TouchableOpacity>

				<Divider />
				<TouchableOpacity style={styles.viewList}>
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

				<Divider />
				<TouchableOpacity style={styles.viewList}>
					<List.Item
						style={styles.list}
						titleStyle={{ fontWeight: 'bold' }}
						title={`Enviar mensaje a ${publication.user.first_name}`}
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
			</Modal>
		</Portal>
	);
};
const styles = StyleSheet.create({
	viewList: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		height: '25%'
	},
	list: {
		justifyContent: 'center',
		height: '100%',
		width: '100%',
		fontWeight: 'bold'
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
		width: '100%',
		alignSelf: 'center',
		justifyContent: 'space-around',
		margin: 0,
		height: 30
	}
});

export default MoreOptionsModal;
