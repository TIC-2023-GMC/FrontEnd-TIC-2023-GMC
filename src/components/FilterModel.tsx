/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme, Portal, Modal, List, IconButton, Divider, Button } from 'react-native-paper';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
const deviceHeight = Dimensions.get('window').height;

interface FilterModalProps {
	visible: boolean;
	navBarHeight: number;
	handlerVisible: () => void;
}

const FilterModal = ({ visible, navBarHeight, handlerVisible }: FilterModalProps) => {
	const theme = useTheme();
	const [checkedDog, setCheckedDog] = useState(false);
	const [checkedCat, setCheckedCat] = useState(false);

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
					height: 300,
					borderTopEndRadius: 20,
					borderTopStartRadius: 20,
					transform: [{ translateY: deviceHeight / 2 - navBarHeight - 150 }]
				}}
			>
				<IconButton
					icon="minus-thick"
					style={styles.iconButton}
					iconColor={theme.colors.tertiary}
					size={30}
					onPress={handlerVisible}
				/>
				<Divider />
				<View style={styles.viewList}>
					<List.Item
						style={styles.list}
						title="Perro"
						onPress={() => setCheckedDog(!checkedDog)}
						left={(props) => (
							<IconButton
								{...props}
								icon={`check-circle${!checkedDog ? '-outline' : ''}`}
								iconColor={!checkedDog ? theme.colors.tertiary : theme.colors.primary}
							/>
						)}
					/>
					<List.Item
						style={styles.list}
						title="Gato"
						onPress={() => setCheckedCat(!checkedCat)}
						left={(props) => (
							<IconButton
								{...props}
								icon={`check-circle${!checkedCat ? '-outline' : ''}`}
								iconColor={!checkedCat ? theme.colors.tertiary : theme.colors.primary}
							/>
						)}
					/>
				</View>
				<Divider />
				<List.Item
					style={styles.listItems}
					title="Ubicación"
					left={(props) => (
						<IconButton {...props} icon="map-marker" iconColor={theme.colors.tertiary} />
					)}
				/>
				<Divider />
				<View style={styles.viewList}>
					<List.Item
						style={styles.listItems}
						title="Ver publicaciones desde:"
						left={(props) => (
							<IconButton {...props} icon="calendar-range" iconColor={theme.colors.tertiary} />
						)}
					/>
					<RNDateTimePicker
						value={new Date()}
						display="spinner"
					/>
				</View>
				<Divider />
				<View style={styles.buttonView}>
					<Button
						style={styles.button}
						mode="elevated"
						buttonColor={theme.colors.primary}
						textColor={theme.colors.secondary}
						onPress={() => {
							console.log('Pressed');
						}}
					>
						Aplicar Filtros
					</Button>
					<Button
						style={styles.button}
						mode="elevated"
						buttonColor={theme.colors.tertiary}
						textColor={theme.colors.secondary}
						onPress={handlerVisible}
					>
						Cancelar
					</Button>
				</View>
			</Modal>
		</Portal>
	);
};
const styles = StyleSheet.create({
	viewList: {
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center'
	},
	list: {
		width: '50%'
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
	}
});

export default FilterModal;
