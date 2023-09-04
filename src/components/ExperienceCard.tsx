/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-unused-styles */
import React, { useRef } from 'react';
import { useState } from 'react';
import { StyleSheet, View, Image, TextLayoutEventData, NativeSyntheticEvent } from 'react-native';
import { Button, Card, useTheme, Text, IconButton, List } from 'react-native-paper';
import { AddCommentProps, AddOrRemoveLikeProps, ExperiencePublication, User } from '../models/InterfacesModels';
import { useNavigation } from '@react-navigation/native';
import { TabNavigationParamsList } from '../models/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { snapShotAndShare } from '../utils/utils';
import { MutateOptions } from '@tanstack/react-query';
import { CommentSection } from './CommentSection';

interface CardProps {
	userAccount: User;
	onAddLike?: (
		variables: AddOrRemoveLikeProps,
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onRemoveLike?: (
		variables: AddOrRemoveLikeProps,
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onAddComment?: (
		variables: AddCommentProps,
		options?: MutateOptions<AddCommentProps> | undefined
	) => void;
}

const LeftContent = (props: { size: number; photo: string }) => (
	<Image
		source={{ uri: props.photo }}
		resizeMode="cover"
		resizeMethod="auto"
		style={{ borderRadius: 25, width: props.size + 10, height: props.size + 10 }}
	/>
);

const ExperienceCard = (props: ExperiencePublication & CardProps) => {
	const theme = useTheme();
	const ref = useRef(null);
	const navigation = useNavigation<NativeStackNavigationProp<TabNavigationParamsList>>();

	const [comment, setComment] = useState<boolean>(false);
	const { user, description, publication_date: publicationDate, photo, likes } = props;
	const [expanded, setExpanded] = useState<boolean>();
	const [isTruncated, setIsTruncated] = useState<boolean>(false);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const { userAccount, onAddLike, onRemoveLike, onAddComment, ...experience } = props;

	const [like, setLike] = useState<boolean>(likes.some((like) => like.user_id === userAccount._id));
	const [numberOfLikes, setNumberOfLikes] = useState<number>(likes.length);

	const addOrRemoveLikeRequest = {
		user_id: userAccount._id ? userAccount._id : '',
		pub_id: experience._id,
		is_adoption: false
	};

	const handleTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
		const { lines } = event.nativeEvent;
		if (lines.length > 2) {
			setIsTruncated(true);
		} else {
			setIsTruncated(false);
		}
	};

	return (
		<>
			<CommentSection
				visible={comment}
				onDismiss={() => setComment(!comment)}
				onAddComment={onAddComment}
				pubId={experience._id}
				isAdoption={false}
			/>
			<View ref={ref}>
				<Card style={styles.card}>
					<Card.Title
						title={
							<Button
								onPress={() => {
									navigation.navigate('Perfil', {
										screen: 'Perfil de Usuarios',
										params: { userId: user._id || '' }
									});
								}}
							>
								{user.first_name + ' ' + user.last_name}
							</Button>
						}
						subtitle={
							<Text style={{ color: theme.colors.tertiary }}>
								{'Publicado el ' +
									new Date(publicationDate).toLocaleString('es-ES', {
										timeZone: 'America/Guayaquil',
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										hour12: false, // Force 24-hour format
										hourCycle: 'h23' // Ensure two digits for hours
									})}
							</Text>
						}
						left={(props) => <LeftContent {...props} photo={user.photo.img_path} />}
					/>
					<Card.Cover
						theme={{ ...theme, roundness: 0.5 }}
						style={styles.img}
						resizeMode="contain"
						resizeMethod="scale"
						source={{ uri: photo.img_path }}
						loadingIndicatorSource={{ uri: photo.img_path }}
						progressiveRenderingEnabled={true}
					/>
					<Card.Content style={styles.content}>
						<List.Item
							style={styles.list}
							titleStyle={styles.title}
							title={'Mi experiencia'}
							left={() => <List.Icon color={theme.colors.tertiary} icon="account-heart" />}
						/>
						<Text
							style={styles.description}
							numberOfLines={expanded ? undefined : 2}
							onTextLayout={handleTextLayout}
						>
							{description}
						</Text>
					</Card.Content>

					<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
						<View style={styles.actionMore}>
							<Button mode="text" onPress={handleExpand} disabled={!isTruncated}>
								{expanded ? 'Ver menos' : 'Ver más'}
							</Button>
						</View>

						<View style={styles.actionsContainer}>
							<View style={{ ...styles.actions, width: '5%' }}>
								<Text
									style={{
										...styles.likeCountText,
										color: like ? theme.colors.primary : theme.colors.tertiary
									}}
								>
									{numberOfLikes >= 1000
										? numberOfLikes >= 10000
											? (numberOfLikes / 1000).toFixed(0) + 'K'
											: (numberOfLikes / 1000).toFixed(1) + 'K'
										: numberOfLikes}
								</Text>
							</View>
							<View style={styles.actions}>
								<IconButton
									animated={true}
									size={28}
									icon="heart"
									iconColor={!like ? theme.colors.tertiary : theme.colors.primary}
									onPress={() => {
										if (!like && onAddLike !== undefined) {
											onAddLike(addOrRemoveLikeRequest, {
												onSuccess: () => {
													setNumberOfLikes(numberOfLikes + 1);
													setLike(true);
												}
											});
										} else if (like && onRemoveLike !== undefined) {
											onRemoveLike(addOrRemoveLikeRequest, {
												onSuccess: () => {
													setNumberOfLikes(numberOfLikes - 1);
													setLike(false);
												}
											});
										}
									}}
								/>
							</View>
							<View style={styles.actions}>
								<IconButton
									size={28}
									icon="comment"
									iconColor={theme.colors.tertiary}
									onPress={() => setComment(!comment)}
								/>
							</View>

							<View style={styles.actions}>
								<IconButton
									size={28}
									icon="share-variant"
									iconColor={theme.colors.tertiary}
									onPress={() => snapShotAndShare(ref)}
								/>
							</View>
						</View>
					</View>
				</Card>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	img: {
		width: '100%',
		borderRadius: 0
	},
	card: {
		justifySelf: 'flex-start',
		alignSelf: 'center',
		height: 'auto',
		flexGrow: 1,
		width: '95%',
		borderRadius: 10,
		backgroundColor: 'white',
		marginTop: 15
	},
	content: {
		marginTop: 10,
		paddingHorizontal: 15,
		justifyContent: 'space-between'
	},
	actionsContainer: {
		padding: 0,
		marginTop: 0,
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '40%'
	},
	actions: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 0,
		borderRadius: 0,
		padding: 0,
		width: '30%'
	},
	actionMore: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 16,
		fontWeight: '700'
	},
	description: {
		fontSize: 15,
		textAlign: 'justify'
	},
	list: {
		paddingVertical: 0,
		paddingRight: 0,
		marginVertical: 0
	},
	likeCountText: {
		fontWeight: 'bold'
	}
});
export default ExperienceCard;
