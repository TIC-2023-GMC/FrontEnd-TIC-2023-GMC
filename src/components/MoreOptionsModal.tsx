/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Portal, Modal, List, IconButton, Divider, Button } from 'react-native-paper';
import { Filter } from '../Screens/Experience/ExperienceScreen';
import { AdoptionPublication, User } from '../models/InterfacesModels';

const deviceHeight = Dimensions.get('window').height;

interface FilterModalProps {
	publication: AdoptionPublication;
	visible: boolean;
	navBarHeight: number;
	handlerVisible: () => void;
	onSaveAsFavorite: (p: AdoptionPublication) => void;
	filter: Filter;
}

const MoreOptionsModal = ({
	publication,
	visible,
	navBarHeight,
	handlerVisible,
	onSaveAsFavorite,
	filter
}: FilterModalProps) => {
	const theme = useTheme();
	

	const user: User = {
		first_name: 'Test',
		last_name: 'Test',
		mobile_phone: '0983473043',
		neighborhood: 'Cumbayá',
		email: 'gandhygarcia@outlook.es',
		password: 'password123',
		num_previous_pets: 2,
		num_current_pets: 1,
		outdoor_hours: 6,
		house_space: 100,
		has_yard: false,
		main_pet_food: 'homemade',
		pet_expenses: 40.5,
		motivation: 'Love for animals',
		favorite_adoption_publications: [],
		photo: {
			_id: '2',
			img_path: 'https://scontent.fgye1-1.fna.fbcdn.net/v/t1.6435-9/74242360_3195954163812838_4274861617784553472_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFRCjYsTZuQlf2PHyTPJ3HYymegSJbxrSjKZ6BIlvGtKPYIzlm5LEqBr9cR0tDl-FEvtHfkBqZQ6LHCgw-pkTlW&_nc_ohc=dye6H3TWD6QAX-v2xOF&_nc_ht=scontent.fgye1-1.fna&oh=00_AfCF85oDfvg1CEtIJ1We_mJ3gV49fRwyklxfDfl8SouHOA&oe=64D84DE2',
		}
	};

	const [checkedFavorite, setCheckedFavorite] = useState<boolean | undefined>(
		user.favorite_adoption_publications.includes(publication._id)
	);


	const handlerSavedAsFavorite = () => {
		handlerVisible();
	};
	useEffect(() => {}, [filter]);

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
						title="Guardar en favoritos"
						onPress={() => {
							setCheckedFavorite(!checkedFavorite);
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
						onPress={() => {}}
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
						onPress={() => {}}
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
