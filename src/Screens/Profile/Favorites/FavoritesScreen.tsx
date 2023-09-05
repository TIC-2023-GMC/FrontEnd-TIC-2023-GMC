import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
	useScrollToTop
} from '@react-navigation/native';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { BackHandler, FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import { UserContext, UserContextParams } from '../../../auth/userContext';
import AdoptionCard from '../../../components/AdoptionCard';
import MoreOptionsModal from '../../../components/MoreOptionsModal';
import {
	AddCommentProps,
	AddOrRemoveLikeProps,
	AdoptionPublication,
	SaveOrRemoveFavoriteProps
} from '../../../models/InterfacesModels';
import { del, post } from '../../../services/api';
import {
	getAddCommentEndpoint,
	getAddLikeEndpoint,
	getListFavoritesAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint,
	getRemoveLikeEndpoint
} from '../../../services/endpoints';
import { resetNavigationStack } from '../../../utils/utils';
import { styles } from './FavoritesScreen.styles';

interface FavoritesScreenValues {
	0: AdoptionPublication[];
	1: number;
}

const MemoizedAdoptionCard = memo(AdoptionCard);
const MemoizedMoreOptionsModal = memo(MoreOptionsModal);

export function FavoritesScreen() {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
	const tabBarHeight = useBottomTabBarHeight();
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
	const [visibleSnackBar, setvisibleSnackBar] = useState(false);
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const [publicationSelected, setPublicationSelected] = useState<AdoptionPublication>({
		_id: '',
		user: user,
		description: '',
		publication_date: new Date(),
		photo: {
			img_path: ''
		},
		likes: [],
		comments: [],
		species: '',
		pet_size: '',
		pet_breed: '',
		pet_age: 0,
		pet_sex: undefined,
		pet_location: '',
		sterilized: false,
		vaccination_card: false
	});
	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
		useInfiniteQuery({
			queryKey: ['Favorites'],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await post<FavoritesScreenValues>(
					getListFavoritesAdoptionsEndpoint({ pageParam, pageSize }),
					user.favorite_adoption_publications
				);

				return response.data;
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			},
			refetchOnWindowFocus: true,
			refetchIntervalInBackground: true,
			refetchOnMount: 'always'
		});

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
		}, [user.favorite_adoption_publications])
	);

	const addLikeMutation = useMutation({
		mutationFn: (data: AddOrRemoveLikeProps) => {
			return post(
				getAddLikeEndpoint({
					userId: data.user_id,
					pubId: data.pub_id,
					isAdoption: data.is_adoption
				})
			).then((response) => response.data);
		},
		onSuccess: () => {
			refetch();
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const removeLikeMutation = useMutation({
		mutationFn: (data: AddOrRemoveLikeProps) => {
			return del(
				getRemoveLikeEndpoint({
					userId: data.user_id,
					pubId: data.pub_id,
					isAdoption: data.is_adoption
				})
			).then((response) => response.data);
		},
		onSuccess: () => {
			refetch();
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const addCommentMutation = useMutation({
		mutationFn: (data: AddCommentProps) => {
			return post(getAddCommentEndpoint(), data).then((response) => response.data);
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const removePublicationFromFavoritesMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) =>
			del(getRemoveFavoriteAdoptionEndpoint(), { data: data }).then((response) => response.data),
		onSuccess: () => {
			setvisibleSnackBar(true);
		},
		onError: (error) => {
			console.log(error);
		}
	});

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
				onDismiss={() => setvisibleSnackBar(false)}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación eliminada de favoritos
			</Snackbar>
		</>
	);
}
