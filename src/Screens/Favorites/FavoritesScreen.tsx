import React, { useRef, useState, memo, useCallback, useContext } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './FavoritesScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { del, post } from '../../services/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import AdoptionCard from '../../components/AdoptionCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { AdoptionPublication, SaveOrRemoveFavoriteProps } from '../../models/InterfacesModels';
import { useFocusEffect } from '@react-navigation/native';
import MoreOptionsModal from '../../components/MoreOptionsModal';
import { UserContext, UserContextParams } from '../../auth/userContext';

interface FavoritesScreenValues {
	0: AdoptionPublication[];
	1: number;
}

const MemoizedAdoptionCard = memo(AdoptionCard);
const MemoizedMoreOptionsModal = memo(MoreOptionsModal);

export function FavoritesScreen() {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const [publicationSelected, setPublicationSelected] = useState<AdoptionPublication>({
		_id: '',
		user: user,
		description: '',
		publication_date: new Date(),
		photo: {
			_id: '',
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
			queryKey: ['Favorites'],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await post<FavoritesScreenValues>(
					`/user/list_favorite_adoptions?page_number=${pageParam}&page_size=${pageSize}`,
					user.favorite_adoption_publications
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
		}, [user.favorite_adoption_publications])
	);

	const removePublicationFromFavoritesMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) =>
			del('/user/remove_favorite_adoption', { data: data }).then((response) => response.data),
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
				visible={isMoreModalVisible}
				handlerVisible={() => setIsMoreModalVisible(false)}
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
					/>
				)}
				initialNumToRender={pageSize}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					<View style={styles.activityIndicator}>
						<Text>No hay más publicaciones</Text>
					</View>
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
					!hasNextPage ? (
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
		</>
	);
}
