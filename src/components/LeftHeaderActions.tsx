import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

export default function RightHeaderActions({
	visible,
	setVisible,
	setPublicationsVisibleFilter,
	...props
}: {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setPublicationsVisibleFilter: React.Dispatch<React.SetStateAction<boolean>>;
	props?: {
		tintColor?: string | undefined;
		pressColor?: string | undefined;
		pressOpacity?: number | undefined;
	};
}) {
	const theme = useTheme();
	return (
		<View style={styles.container}>
			<IconButton
				icon="controller-classic"
				iconColor={theme.colors.secondary}
				size={40}
				{...props}
				onPress={() => setVisible(!visible)}
				style={styles.icon}
			/>
			<IconButton
				icon="filter"
				iconColor={theme.colors.secondary}
				size={30}
				{...props}
				onPress={() => {
					setPublicationsVisibleFilter(true);
				}}
				style={styles.icon}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	icon: {
		margin: 0
	}
});
