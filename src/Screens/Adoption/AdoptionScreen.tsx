import React, { useRef, useState, memo, useCallback, useContext } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get, post, del } from '../../services/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import AdoptionCard from '../../components/AdoptionCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/AdoptionsFilterModal';
import { useFocusEffect } from '@react-navigation/native';
import MoreOptionsModal from '../../components/MoreOptionsModal';
import { UserContext, UserContextParams } from '../../auth/userContext';
import {
	getAddFavoriteAdoptionEndpoint,
	getListAdoptionsEndpoint,
	getRemoveFavoriteAdoptionEndpoint,
	getAddLikeEndpoint,
	getRemoveLikeEndpoint
} from '../../services/endpoints';
import {
	AdoptionPublication,
	AdoptionFilter,
	SaveOrRemoveFavoriteProps,
	AddOrRemoveLikeProps
} from '../../models/InterfacesModels';

interface AdoptionPublicationScreen {
	0: AdoptionPublication[];
	1: number;
}

const MemoizedAdoptionCard = memo(AdoptionCard);
const MemoizedFilterModal = memo(FilterModal);
const MemoizedMoreOptionsModal = memo(MoreOptionsModal);

export function AdoptionScreen({
	visibleFilter,
	setVisibleFilter
}: {
	visibleFilter: boolean;
	// eslint-disable-next-line no-unused-vars
	setVisibleFilter: (visible: boolean) => void;
}) {
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const theme = useTheme();
	const [visibleSnackBar, setVisibleSnackBar] = useState([false, false]);
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [filter, setFilter] = useState<AdoptionFilter>({} as AdoptionFilter);
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
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

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useInfiniteQuery({
			queryKey: ['Adoption', filter],
			queryFn: async ({ pageParam = 1 }) => {
				const newDate = filter?.date ? new Date(filter?.date) : undefined;
				if (newDate) {
					newDate.setUTCHours(0, 0, 0, 0);
				}
				const response = await get<AdoptionPublicationScreen>(
					getListAdoptionsEndpoint({ pageParam, filter, pageSize, newDate })
				);
				return response.data;
			},
			getNextPageParam: (lastPage) => {
				if (lastPage[0].length !== 0) {
					return lastPage[1];
				}
				return undefined;
			}
		});

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};
	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [])
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
			console.log('like');
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
			console.log('remove like');
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const savePublicationAsFavoriteMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) => {
			return post(getAddFavoriteAdoptionEndpoint(), data).then((response) => response.data);
		},
		onSuccess: () => {
			setVisibleSnackBar([true, false]);
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const removePublicationFromFavoritesMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) =>
			del(getRemoveFavoriteAdoptionEndpoint(), { data: data }).then((response) => response.data),
		onSuccess: () => {
			setVisibleSnackBar([false, true]);
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
			<MemoizedFilterModal
				filter={filter}
				visible={visibleFilter}
				navBarHeight={tabBarHeight}
				handlerVisible={() => setVisibleFilter(false)}
				onApplyFilter={setFilter}
				handlerCancel={() => setFilter({} as AdoptionFilter)}
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
						onSaveAsFavorite={savePublicationAsFavoriteMutation.mutate}
						onRemoveFromFavorites={removePublicationFromFavoritesMutation.mutate}
						onAddLike={addLikeMutation.mutate}
						onRemoveLike={removeLikeMutation.mutate}
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
							<Text>No hay más publicaciones</Text>
						</View>
					)
				}
			/>
			<Snackbar
				theme={theme}
				visible={visibleSnackBar[0]}
				onDismiss={() => setVisibleSnackBar([false, false])}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación guardada en favoritos
			</Snackbar>
			<Snackbar
				theme={theme}
				visible={visibleSnackBar[1]}
				onDismiss={() => setVisibleSnackBar([false, false])}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación eliminada de favoritos
			</Snackbar>
		</>
	);
}
export { AdoptionFilter };
