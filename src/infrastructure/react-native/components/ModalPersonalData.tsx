import React from 'react';
import { Modal, PaperProvider, Portal, Text, useTheme } from 'react-native-paper';

export const ModalPersonalData = ({
	modalVisible,
	setModalVisible,
	children
}: {
	modalVisible: boolean;
	// eslint-disable-next-line no-unused-vars
	setModalVisible: (value: boolean) => void;
	children: React.ReactNode;
}) => {
	const theme = useTheme();
	const hideModal = () => setModalVisible(false);

	return (
		<PaperProvider theme={theme}>
			<Portal>
				<Modal
					visible={modalVisible}
					onDismiss={hideModal}
					style={{ justifyContent: 'center', alignItems: 'center' }}
					contentContainerStyle={{
						backgroundColor: theme.colors.secondary,
						justifyContent: 'center',
						alignContent: 'center',
						height: '25%',
						width: '90%',
						borderRadius: 20,
						padding: 20
					}}
				>
					<Text variant="titleSmall">1. Recopilación y Uso:</Text>
					<Text>
						Al usar nuestros servicios, aceptas la recopilación y uso de tus datos personales.
					</Text>
					<Text variant="titleSmall">2. Consentimiento:</Text>
					<Text>Tu participación implica consentimiento para el procesamiento de tus datos.</Text>
				</Modal>
			</Portal>
			{children}
		</PaperProvider>
	);
};
