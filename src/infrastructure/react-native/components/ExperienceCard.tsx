/* eslint-disable react-native/no-unused-styles */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MutateOptions } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { Image, NativeSyntheticEvent, StyleSheet, TextLayoutEventData, View } from 'react-native';
import { Button, Card, IconButton, List, Text, useTheme } from 'react-native-paper';
import ReactTimeAgo from 'react-time-ago';
import {
	AddCommentProps,
	AddOrRemoveLikeProps,
	Publication,
	User
} from '../../../domain/models/InterfacesModels';
import { TabNavigationParamsList } from '../../../domain/types/types';
import { snapShotAndShare } from '../../../utils/utils';
import { CommentSection } from './CommentSection';

interface CardProps {
	userAccount: User;
	onAddLike?: (
		// eslint-disable-next-line no-unused-vars
		variables: AddOrRemoveLikeProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onRemoveLike?: (
		// eslint-disable-next-line no-unused-vars
		variables: AddOrRemoveLikeProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onAddComment?: (
		// eslint-disable-next-line no-unused-vars
		variables: AddCommentProps,
		// eslint-disable-next-line no-unused-vars
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

const ExperienceCard = (props: Publication & CardProps) => {
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
	const handleLike = () => {
		const like = likes.some((like) => like.user_id === userAccount._id);
		if (!like && onAddLike !== undefined) {
			onAddLike(addOrRemoveLikeRequest);
		} else if (like && onRemoveLike !== undefined) {
			onRemoveLike(addOrRemoveLikeRequest);
		}
	};
	const { userAccount, onAddLike, onRemoveLike, onAddComment, ...experience } = props;

	const addOrRemoveLikeRequest = {
		user_id: userAccount._id ?? '',
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
							<ReactTimeAgo
								date={new Date(publicationDate)}
								timeStyle="round-minute"
								component={Text}
								style={{ color: theme.colors.tertiary }}
							/>
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
										color: likes.some((like) => like.user_id === userAccount._id)
											? theme.colors.primary
											: theme.colors.tertiary
									}}
								>
									{likes.length >= 1000
										? likes.length >= 10000
											? (likes.length / 1000).toFixed(0) + 'K'
											: (likes.length / 1000).toFixed(1) + 'K'
										: likes.length}
								</Text>
							</View>
							<View style={styles.actions}>
								<IconButton
									animated={true}
									selected={likes.some((like) => like.user_id === userAccount._id)}
									size={28}
									icon="heart"
									onPress={handleLike}
								/>
							</View>
							<View style={styles.actions}>
								<IconButton
									animated={true}
									size={28}
									icon="comment"
									iconColor={theme.colors.tertiary}
									onPress={() => setComment(!comment)}
								/>
							</View>

							<View style={styles.actions}>
								<IconButton
									animated={true}
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
