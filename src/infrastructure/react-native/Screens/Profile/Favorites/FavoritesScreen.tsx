import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
	useScrollToTop
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { BackHandler, FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../../application/auth/user.auth';
import {
	AddCommentUseCase,
	AddLikeUseCase,
	ListFavoritesUseCase,
	RemoveFromFavoritesUseCase,
	RemoveLikeUseCase
} from '../../../../../application/hooks';
import { AdoptionPublication } from '../../../../../domain/models/InterfacesModels';
import { resetNavigationStack } from '../../../../../utils/utils';
import AdoptionCard from '../../../components/AdoptionCard';
import MoreOptionsModal from '../../../components/MoreOptionsModal';
import { styles } from './FavoritesScreen.styles';

const listFavorites = container.resolve(ListFavoritesUseCase);
const addLike = container.resolve(AddLikeUseCase);
const removeLike = container.resolve(RemoveLikeUseCase);
const addComment = container.resolve(AddCommentUseCase);

const removeFromFavorites = container.resolve(RemoveFromFavoritesUseCase);
const MemoizedAdoptionCard = memo(AdoptionCard);
const MemoizedMoreOptionsModal = memo(MoreOptionsModal);

export function FavoritesScreen() {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
	const tabBarHeight = useBottomTabBarHeight();
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
	const [visibleSnackBar, setVisibleSnackBar] = useState(false);
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const [publicationSelected, setPublicationSelected] = useState<AdoptionPublication>({
		_id: '',
		user: user,
		description: '',
		publication_date: new Date(),
		photo: {
			img_path: ''
		},
		likes: [0, false] as [number, boolean],
		species: '',
		pet_size: '',
		pet_breed: '',
		pet_age: 0,
		pet_sex: undefined,
		pet_location: '',
		sterilized: false,
		vaccination_card: false,
		is_favorite: false
	});
	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
		listFavorites.useQueryFavorites(pageSize);

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};
	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					resetNavigationStack(navigation, 'Perfil');
					return true;
				}
				return false;
			};
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);
			return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		}, [])
	);
	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
	);

	const { addLikeMutation } = addLike.useMutationAddLike('Favorites');
	const { removeLikeMutation } = removeLike.useMutationRemoveLike('Favorites');

	const { addCommentMutation } = addComment.useMutationAddComment();

	const { removePublicationFromFavoritesMutation } =
		removeFromFavorites.useMutationRemoveFromFavorites('Favorites', undefined, setVisibleSnackBar);

	const handleOpenModal = (publication: AdoptionPublication) => {
		setPublicationSelected(publication);
		setIsMoreModalVisible(true);
	};

	return (
		<>
			<StatusBar style="light" />
			<MemoizedMoreOptionsModal
				publication={publicationSelected}
				modalVisible={isMoreModalVisible}
				handleModalVisible={() => setIsMoreModalVisible(false)}
				navBarHeight={tabBarHeight}
			/>
			<FlatList
				style={{
					...styles.section,
					marginBottom: tabBarHeight,
					backgroundColor: theme.colors.secondary
				}}
				keyExtractor={(item) => item._id}
				onEndReached={handleLoadMore}
				ref={ref}
				data={data?.pages.flatMap((page) => page[0])}
				renderItem={({ item }) => (
					<MemoizedAdoptionCard
						{...item}
						setUserAccount={setUser}
						userAccount={user}
						onOpenModal={handleOpenModal}
						onRemoveFromFavorites={removePublicationFromFavoritesMutation.mutate}
						onAddLike={addLikeMutation.mutate}
						onRemoveLike={removeLikeMutation.mutate}
						onAddComment={addCommentMutation.mutate}
					/>
				)}
				initialNumToRender={pageSize}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					hasNextPage ? (
						<View style={styles.activityIndicator}>
							<Text>No hay más publicaciones</Text>
						</View>
					) : null
				}
				refreshControl={
					<RefreshControl
						refreshing={isFetchingNextPage || isLoading || isFetching}
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
							<Text>No hay más publicaciones</Text>
						</View>
					)
				}
			/>
			<Snackbar
				theme={theme}
				visible={visibleSnackBar}
				onDismiss={() => setVisibleSnackBar(false)}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación eliminada de favoritos
			</Snackbar>
		</>
	);
}
