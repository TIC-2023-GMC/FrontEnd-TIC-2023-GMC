import { StyleSheet, Modal, View, FlatList, RefreshControl } from 'react-native';
import { Text, MD3Theme, TextInput, useTheme, ActivityIndicator } from 'react-native-paper';
import { CommentComponent } from './CommentComponent';
import React, { useState } from 'react';
import { Comment } from '../models/InterfacesModels';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getListCommentsEndpoint } from '../services/endpoints';
import { post } from '../services/api';

interface CommentsResults {
	0: Comment[];
	1: number;
}

interface CommentSectionProps {
	visible: boolean;
	onDismiss?: () => void;
	comments: Comment[];
}
export function CommentSection({ onDismiss, visible, comments }: CommentSectionProps) {
	const theme = useTheme();
	const styles = createStyles(theme);
	const [newComment, setNewComment] = useState('');

	const pageSize = 6;
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading } =
		useInfiniteQuery({
			queryKey: ['Comments'],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await post<CommentsResults>(
					getListCommentsEndpoint({ pageParam, pageSize }),
					comments
				);
				return response.data;
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			},
			enabled: visible
		});

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};

	return (
		<Modal animationType="slide" transparent visible={visible} onRequestClose={onDismiss}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Comentarios</Text>
					<FlatList
						style={styles.flatList}
						keyExtractor={(item) => item._id}
						onEndReached={handleLoadMore}
						data={data?.pages.flatMap((page) => page[0])}
						renderItem={({ item }) => <CommentComponent {...item} />}
						initialNumToRender={pageSize}
						onEndReachedThreshold={0.5}
						ListEmptyComponent={
							hasNextPage ? (
								<View style={styles.activityIndicator}>
									<Text>No hay más comentarios</Text>
								</View>
							) : null
						}
						refreshControl={
							<RefreshControl
								refreshing={isFetchingNextPage || isLoading}
								onRefresh={() => {
									refetch();
								}}
							/>
						}
						ListFooterComponent={
							hasNextPage ? (
								<>
									{isFetchingNextPage ? (
										<ActivityIndicator size="large" style={styles.activityIndicator} />
									) : null}
								</>
							) : (
								<View style={styles.activityIndicator}>
									<Text>No hay más comentarios</Text>
								</View>
							)
						}
					/>
					<View style={styles.inputContainer}>
						<TextInput
							theme={theme}
							style={styles.input}
							value={newComment}
							onChangeText={setNewComment}
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
			flex: 1,
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
		},
		activityIndicator: {
			margin: 15,
			justifyContent: 'center',
			alignItems: 'center'
		}
	});
