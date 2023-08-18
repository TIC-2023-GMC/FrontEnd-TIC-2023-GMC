import { StyleSheet, Modal, View, FlatList, RefreshControl } from 'react-native';
import { Text, MD3Theme, TextInput, useTheme } from 'react-native-paper';
import { CommentComponent } from './CommentComponent';
import React, { useContext, useState } from 'react';
import { UserContext } from '../auth/userContext';
interface CommentSectionProps {
	visible: boolean;
	onDismiss: () => void;
	handlerGetComments?: () => void;
	isLoading?: boolean;
	refresh?: () => void;
}
export function CommentSection({
	onDismiss,
	visible,
	handlerGetComments,
	refresh,
	isLoading
}: CommentSectionProps) {
	const theme = useTheme();
	const { user } = useContext(UserContext);
	const styles = createStyles(theme);
	const [comment, setComment] = useState('');
	const comments = [
		{
			_id: '1',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '2',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '3',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '4',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '5',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '6',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		}
	];
	/* const [comments, setComments] = useState<Comment[]>([
		{
			_id: '1',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '2',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '3',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '4',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '5',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		},
		{
			_id: '6',
			comment_text: 'Hola Mundo',
			comment_date: new Date().toISOString(),
			user: user
		}
	]); */
	// const handleSendComment = () => {
	// 	setComments((prevComments) => [...prevComments, comment]);
	// 	setComment('');
	// };
	return (
		<Modal
			animationType="slide"
			transparent
			visible={visible}
			onDismiss={onDismiss}
			onRequestClose={onDismiss}
			onShow={handlerGetComments}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Comentarios</Text>
					<FlatList
						refreshControl={
							<RefreshControl
								refreshing={isLoading ? true : false}
								onRefresh={() => {
									refresh ? refresh() : null;
								}}
							/>
						}
						ListEmptyComponent={() => <Text style={styles.emptyList}>No hay comentarios</Text>}
						style={styles.flatList}
						data={comments}
						keyExtractor={(item) => item._id}
						renderItem={({ item }) => <CommentComponent {...item} />}
					/>
					<View style={styles.inputContainer}>
						<TextInput
							theme={theme}
							style={styles.input}
							value={comment}
							onChangeText={setComment}
							placeholder="Escribe un comentario..."
							mode="outlined"
							right={<TextInput.Icon icon="send-circle" size={40} color={theme.colors.primary} />}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
}
const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		centeredView: {
			flex: 1,
			justifyContent: 'flex-end',
			alignItems: 'center'
		},
		modalView: {
			width: '99.5%',
			height: '100%',
			backgroundColor: theme.colors.secondary,
			borderRadius: 10,
			padding: 15,
			paddingBottom: 0,
			shadowColor: theme.colors.secondary,
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5
		},
		flatList: {
			flex: 1,
			flexDirection: 'column',
			width: '100%'
		},
		textStyle: {
			color: 'white',
			fontWeight: 'bold',
			textAlign: 'center'
		},
		modalText: {
			marginBottom: 5,
			textAlign: 'left',
			fontWeight: 'bold',
			fontSize: 20
		},
		inputContainer: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		input: {
			flex: 1,
			backgroundColor: theme.colors.secondary,
			marginBottom: 10,
			marginTop: 5
		},
		emptyList: {
			flex: 1,
			textAlign: 'center',
			fontSize: 15,
			marginTop: 10
		}
	});
