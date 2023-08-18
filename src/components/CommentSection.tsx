import * as React from 'react';
import { StyleSheet, Modal, View, Pressable } from 'react-native';
import { Text, Portal, MD3Theme } from 'react-native-paper';
interface CommentSectionProps {
	visible: boolean;
	tabBarHeight: number;
	theme: MD3Theme;
	onDismiss: () => void;
}
export function CommentSection({ onDismiss, visible, tabBarHeight, theme }: CommentSectionProps) {
	const styles = createStyles(theme, tabBarHeight);
	return (
		<Modal animationType="slide" transparent visible={visible} onDismiss={onDismiss}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Comentarios</Text>
					<Pressable style={[styles.button, styles.buttonClose]} onPress={onDismiss}>
						<Text style={styles.textStyle}>Hide Modal</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
const createStyles = (theme: MD3Theme, tabBarHeight: number) =>
	StyleSheet.create({
		centeredView: {
			flex: 1,
			justifyContent: 'flex-end',
			alignItems: 'center'
		},
		modalView: {
			width: '100%',
			height: '70%',
			backgroundColor: 'white',
			borderRadius: 10,
			padding: 15,
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5
		},
		button: {
			borderRadius: 20,
			padding: 10,
			elevation: 2
		},
		buttonOpen: {
			backgroundColor: '#F194FF'
		},
		buttonClose: {
			backgroundColor: '#2196F3'
		},
		textStyle: {
			color: 'white',
			fontWeight: 'bold',
			textAlign: 'center'
		},
		modalText: {
			marginBottom: 15,
			textAlign: 'left',
			fontWeight: 'bold',
			fontSize: 20
		}
	});
