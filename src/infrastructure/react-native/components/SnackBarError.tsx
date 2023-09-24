import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

export function SnackBarError({
	failUpload,
	setFailUpload,
	reset
}: {
	failUpload: string;
	setFailUpload: React.Dispatch<React.SetStateAction<string>>;
	reset: () => void;
}) {
	const theme = useTheme();

	return (
		<Snackbar
			theme={theme}
			visible={failUpload !== ''}
			onDismiss={() => setFailUpload('')}
			action={{
				label: 'Reintentar',
				onPress: () => {
					reset();
				}
			}}
		>
			{failUpload}
		</Snackbar>
	);
}
