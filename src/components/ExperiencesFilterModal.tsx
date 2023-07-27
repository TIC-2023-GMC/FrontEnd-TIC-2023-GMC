/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme, Portal, Modal, List, IconButton, Divider, Button } from 'react-native-paper';
import { registerTranslation, DatePickerInput } from 'react-native-paper-dates';
import { Filter } from '../Screens/Experience/ExperienceScreen';
registerTranslation('es', {
	save: 'Guardar',
	selectSingle: 'Seleccionar fecha',
	selectMultiple: 'Seleccionar fechas',
	selectRange: 'Seleccionar período',
	notAccordingToDateFormat: (inputFormat) => `El formato de fecha debe ser ${inputFormat}`,
	mustBeHigherThan: (date) => `Debe ser después de ${date}`,
	mustBeLowerThan: (date) => `Debe ser antes de ${date}`,
	mustBeBetween: (startDate, endDate) => `Debe estar entre ${startDate} - ${endDate}`,
	dateIsDisabled: 'Día no permitido',
	previous: 'Anterior',
	next: 'Siguiente',
	typeInDate: 'Escribir fecha',
	pickDateFromCalendar: 'Seleccionar fecha del calendario',
	close: 'Cerrar'
});

const deviceHeight = Dimensions.get('window').height;

interface FilterModalProps {
	visible: boolean;
	navBarHeight: number;
	handlerVisible: () => void;
	onApplyFilter: React.Dispatch<React.SetStateAction<Filter>>;
	handlerCancel: () => void;
	filter: Filter;
}

const FilterModal = ({
	visible,
	navBarHeight,
	handlerVisible,
	onApplyFilter,
	handlerCancel,
	filter
}: FilterModalProps) => {
	const theme = useTheme();
	const [checkedDog, setCheckedDog] = useState<boolean | undefined>(filter.species === 'Perro');
	const [checkedCat, setCheckedCat] = useState<boolean | undefined>(filter.species === 'Gato');
	const [date, setDate] = useState<Date | undefined>(filter.date);

	const handlerApplyFilter = () => {
		onApplyFilter({
			species: checkedCat ? 'Gato' : checkedDog ? 'Perro' : undefined,
			date
		});

		handlerVisible();
	};
	useEffect(() => {
		setCheckedCat(filter.species === 'Gato');
		setCheckedDog(filter.species === 'Perro');
		setDate(filter.date);
	}, [filter]);

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
					height: 250,
					borderTopEndRadius: 20,
					borderTopStartRadius: 20,
					transform: [{ translateY: deviceHeight / 2 - navBarHeight - 125 }]
				}}
			>
				<IconButton
					icon="chevron-down"
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
						onPress={() => {
							setCheckedDog(!checkedDog);
							setCheckedCat(false);
						}}
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
						onPress={() => {
							setCheckedCat(!checkedCat);
							setCheckedDog(false);
						}}
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
				<DatePickerInput
					locale="es"
					label="Ver publicaciones desde:"
					value={date}
					onChange={(d) => setDate(d)}
					inputMode="start"
					mode="outlined"
					style={{ backgroundColor: 'transparent', color: theme.colors.tertiary }}
					calendarIcon="calendar-range"
					outlineStyle={{ borderColor: 'transparent' }}
					right={
						<IconButton
							icon="pet"
							iconColor={theme.colors.tertiary}
							style={{ alignSelf: 'center', justifyContent: 'space-around', margin: 0, height: 30 }}
						/>
					}
				/>

				<Divider />
				<View style={styles.buttonView}>
					<Button
						style={styles.button}
						mode="elevated"
						buttonColor={theme.colors.primary}
						textColor={theme.colors.secondary}
						onPress={handlerApplyFilter}
					>
						Aplicar Filtros
					</Button>
					<Button
						style={styles.button}
						mode="elevated"
						buttonColor={theme.colors.tertiary}
						textColor={theme.colors.secondary}
						onPress={handlerCancel}
					>
						Reset
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
