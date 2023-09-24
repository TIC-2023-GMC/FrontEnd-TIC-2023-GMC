/* eslint-disable react-native/no-unused-styles */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MutateOptions } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, List, Text, useTheme } from 'react-native-paper';
import ReactTimeAgo from 'react-time-ago';
import {
	AddCommentProps,
	AddOrRemoveLikeProps,
	AdoptionPublication,
	SaveOrRemoveFavoriteProps,
	User
} from '../../../domain/models/InterfacesModels';
import { TabNavigationParamsList } from '../../../domain/types/types';
import { snapShotAndShare } from '../../../utils/utils';
import { CommentSection } from './CommentSection';

interface CardProps {
	onOpenModal?: (_p: AdoptionPublication) => void;
	userAccount: User;
	setUserAccount: React.Dispatch<React.SetStateAction<User>>;
	onSaveAsFavorite?: (
		// eslint-disable-next-line no-unused-vars
		variables: SaveOrRemoveFavoriteProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<SaveOrRemoveFavoriteProps> | undefined
	) => void;
	onRemoveFromFavorites?: (
		// eslint-disable-next-line no-unused-vars
		variables: SaveOrRemoveFavoriteProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<SaveOrRemoveFavoriteProps> | undefined
	) => void;
	onAddLike: (
		// eslint-disable-next-line no-unused-vars
		variables: AddOrRemoveLikeProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onRemoveLike: (
		// eslint-disable-next-line no-unused-vars
		variables: AddOrRemoveLikeProps,
		// eslint-disable-next-line no-unused-vars
		options?: MutateOptions<AddOrRemoveLikeProps> | undefined
	) => void;
	onAddComment: (
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

const PublicationCard = (props: AdoptionPublication & CardProps) => {
	const theme = useTheme();
	const ref = useRef(null);
	const navigation = useNavigation<NativeStackNavigationProp<TabNavigationParamsList>>();

	const [comment, setComment] = useState<boolean>(false);
	const [expanded, setExpanded] = useState<boolean>();
	const {
		user,
		pet_age: petAge,
		pet_size: petSize,
		pet_breed: petBreed,
		description,
		pet_location: petLocation,
		publication_date: publicationDate,
		photo,
		likes,
		pet_sex: petSex,
		vaccination_card: vaccinationCard,
		sterilized
	} = props;

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const {
		setUserAccount,
		userAccount,
		onOpenModal,
		onSaveAsFavorite,
		onRemoveFromFavorites,
		onAddLike,
		onRemoveLike,
		onAddComment,
		...adoption
	} = props;

	const addOrRemoveFavoriteRequest = {
		user_id: userAccount._id ?? '',
		pub_id: adoption._id
	};

	const addOrRemoveLikeRequest = {
		user_id: userAccount._id ?? '',
		pub_id: adoption._id,
		is_adoption: true
	};
	const handleFavorite = () => {
		if (
			!userAccount.favorite_adoption_publications.includes(adoption._id) &&
			onSaveAsFavorite !== undefined
		) {
			onSaveAsFavorite(addOrRemoveFavoriteRequest);
			setUserAccount({
				...userAccount,
				favorite_adoption_publications: [
					...userAccount.favorite_adoption_publications,
					adoption._id
				]
			});
		} else if (
			userAccount.favorite_adoption_publications.includes(adoption._id) &&
			onRemoveFromFavorites !== undefined
		) {
			onRemoveFromFavorites(addOrRemoveFavoriteRequest);
			setUserAccount((prevData) => {
				const newValue = {
					...prevData,
					favorite_adoption_publications: prevData.favorite_adoption_publications.filter(
						(id) => id !== adoption._id
					)
				};
				return newValue;
			});
		}
	};
	const handleLike = () => {
		const like = likes.some((like) => like.user_id === userAccount._id);
		if (!like && onAddLike !== undefined) {
			onAddLike(addOrRemoveLikeRequest);
		} else if (like && onRemoveLike !== undefined) {
			onRemoveLike(addOrRemoveLikeRequest);
		}
	};

	return (
		<>
			<CommentSection
				visible={comment}
				onDismiss={() => setComment(!comment)}
				onAddComment={onAddComment}
				pubId={adoption._id}
			/>
			<View ref={ref} collapsable={false}>
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
						right={
							onOpenModal !== undefined
								? () => <IconButton icon="dots-vertical" onPress={() => onOpenModal(adoption)} />
								: undefined
						}
					/>
					<Card.Cover
						theme={{ ...theme, roundness: 0.5 }}
						style={styles.img}
						resizeMode="contain"
						resizeMethod="scale"
						source={{ uri: photo.img_path }}
						progressiveRenderingEnabled={true}
					/>
					<Card.Content style={styles.content}>
						<View style={styles.contentColumn}>
							<List.Item
								style={styles.list}
								title={
									petAge >= 12
										? Math.round(petAge / 12) > 1
											? Math.round(petAge / 12) + ' años'
											: Math.round(petAge / 12) + ' año'
										: petAge + ' meses'
								}
								left={() => <List.Icon color={theme.colors.tertiary} icon="cake-variant" />}
							/>
							<List.Item
								style={styles.list}
								titleNumberOfLines={2}
								title={petLocation}
								left={() => <List.Icon color={theme.colors.tertiary} icon="map-marker" />}
							/>
							<List.Item
								style={styles.list}
								title={petSize}
								left={() => <List.Icon color={theme.colors.tertiary} icon="ruler" />}
							/>
						</View>
						<View style={styles.contentColumn}>
							<List.Item
								style={styles.list}
								title={'Sexo'}
								left={() => (
									<List.Icon
										color={theme.colors.tertiary}
										icon={`gender-${petSex ? 'male' : 'female'}`}
									/>
								)}
							/>
							<List.Item
								style={styles.list}
								titleNumberOfLines={2}
								title={'Carnet de Vacunación'}
								left={() => (
									<List.Icon
										color={theme.colors.tertiary}
										icon={`${vaccinationCard ? 'check-circle-outline' : 'close-circle-outline'}`}
									/>
								)}
							/>
							<List.Item
								style={styles.list}
								title={'Esterilización'}
								left={() => (
									<List.Icon
										color={theme.colors.tertiary}
										icon={`${sterilized ? 'check-circle-outline' : 'close-circle-outline'}`}
									/>
								)}
							/>
						</View>
					</Card.Content>
					{expanded && (
						<Card.Content>
							<List.Item style={styles.list} title="Raza" description={petBreed} />
							<List.Item style={styles.list} title="Descripción" description={description} />
						</Card.Content>
					)}

					<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
						<View style={styles.actionMore}>
							<Button mode="text" onPress={handleExpand}>
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
									onPress={() => setComment(!comment)}
								/>
							</View>
							{(onSaveAsFavorite !== undefined || onRemoveFromFavorites !== undefined) && (
								<View style={styles.actions}>
									<IconButton
										animated={true}
										onPress={handleFavorite}
										icon={`bookmark`}
										size={28}
										selected={userAccount.favorite_adoption_publications.includes(adoption._id)}
									/>
								</View>
							)}
							<View style={styles.actions}>
								<IconButton
									animated={true}
									size={28}
									icon="share-variant"
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
		width: '95%',
		borderRadius: 10,
		backgroundColor: 'white',
		marginTop: 15
	},
	contentColumn: {
		width: '50%',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	content: {
		flexDirection: 'row',
		marginTop: 10,
		paddingHorizontal: 15,
		justifyContent: 'space-between',
		gap: 20
	},
	actionsContainer: {
		padding: 0,
		marginTop: 0,
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '50%'
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 0,
		borderRadius: 0,
		padding: 0,
		width: '20%'
	},
	actionMore: {
		alignItems: 'center',
		justifyContent: 'center'
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
export default PublicationCard;
