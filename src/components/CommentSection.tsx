/* eslint-disable no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { MutateOptions } from '@tanstack/react-query';
import React, { memo, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FlatList, Modal, RefreshControl, StyleSheet, View } from 'react-native';
import {
	ActivityIndicator,
	HelperText,
	IconButton,
	MD3Theme,
	Snackbar,
	Text,
	TextInput,
	useTheme
} from 'react-native-paper';
import { UserContext, UserContextParams } from '../auth/userContext';
import { useQueryComment } from '../hooks';
import { AddCommentProps, Comment, CommentText } from '../models/InterfacesModels';
import { CommentTextSchema } from '../models/Schemas';
import { CommentComponent } from './CommentComponent';

interface CommentSectionProps {
	visible: boolean;
	onDismiss?: () => void;
	onAddComment?: (
		variables: AddCommentProps,
		options?: MutateOptions<AddCommentProps> | undefined
	) => void;
	pubId: string;
}

const MemoizedCommentComponent = memo(CommentComponent);
export function CommentSection({ onDismiss, visible, onAddComment, pubId }: CommentSectionProps) {
	const { user } = useContext<UserContextParams>(UserContext);
	const theme = useTheme();
	const styles = createStyles(theme);
	const [loading, setLoading] = useState<boolean>(false);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset
	} = useForm({
		resolver: zodResolver(CommentTextSchema),
		defaultValues: {
			comment_text: ''
		}
	});

	const pageSize = 6;
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, remove } =
		useQueryComment(visible, pubId, pageSize);

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};

	const onSubmitComment: SubmitHandler<CommentText> = async (data) => {
		setLoading(true);

		const currentDateUTC = new Date();
		const timezoneOffset = currentDateUTC.getTimezoneOffset() * 60000;
		const currentDateLocal = new Date(currentDateUTC.getTime() - timezoneOffset);

		const addCommentRequest = {
			pub_id: pubId,
			user_id: user?._id ?? '',
			comment_text: data.comment_text,
			comment_date: currentDateLocal
		};

		if (onAddComment !== undefined) {
			onAddComment(addCommentRequest, {
				onSuccess: () => {
					setLoading(false);
					reset();
					refetch();
				}
			});
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent
			visible={visible}
			onRequestClose={() => {
				onDismiss && onDismiss();
				remove();
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Comentarios</Text>
					<FlatList
						style={styles.flatList}
						keyExtractor={(item) => (item as unknown as Comment)._id}
						onEndReached={handleLoadMore}
						data={data?.pages.flatMap((page) => page[0])}
						renderItem={({ item }) => (
							<MemoizedCommentComponent {...(item as unknown as Comment)} />
						)}
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
						extraData={data}
					/>
					<View style={styles.inputContainer}>
						<Controller
							control={control}
							rules={{
								required: true
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<View
									style={{
										...styles.commentContainer,
										height: errors.comment_text ? 120 : 100
									}}
								>
									<TextInput
										numberOfLines={3}
										contentStyle={{
											margin: 0,
											padding: 0,
											lineHeight: 20
										}}
										multiline={true}
										theme={theme}
										placeholderTextColor={theme.colors.tertiary}
										onBlur={onBlur}
										value={value}
										onChangeText={onChange}
										style={styles.input}
										placeholder="Escribe un comentario..."
										mode="outlined"
										error={!!errors.comment_text}
									/>
									{errors.comment_text && (
										<HelperText type="error" style={styles.errorText}>
											{errors.comment_text.message}
										</HelperText>
									)}
								</View>
							)}
							name="comment_text"
						/>

						<IconButton
							icon="send-circle"
							size={45}
							iconColor={theme.colors.primary}
							onPress={handleSubmit(onSubmitComment)}
							disabled={loading}
						/>
					</View>
				</View>
			</View>
			<Snackbar
				theme={theme}
				visible={false}
				onDismiss={() => reset()}
				duration={2000}
				style={{ marginBottom: 150 }}
			>
				Comentario agregado
			</Snackbar>
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
			height: 80,
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
		},
		commentContainer: {
			flex: 1,
			flexDirection: 'column'
		},
		errorText: {
			marginTop: -10,
			marginBottom: 10
		}
	});
