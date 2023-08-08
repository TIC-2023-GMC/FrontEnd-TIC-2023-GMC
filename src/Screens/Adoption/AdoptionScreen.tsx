import React, { useRef, useState, memo, useCallback, useContext } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get, post, del } from '../../services/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import AdoptionCard from '../../components/AdoptionCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/AdoptionsFilterModal';
import { AdoptionPublication, SaveOrRemoveFavoriteProps } from '../../models/InterfacesModels';
import { useFocusEffect } from '@react-navigation/native';
import MoreOptionsModal from '../../components/MoreOptionsModal';
import { UserContext, UserContextParams } from '../../auth/userContext';

interface AdoptionPublicationScreen {
	0: AdoptionPublication[];
	1: number;
}

export interface Filter {
	species: string | undefined;
	date: Date | undefined;
	location: string | undefined;
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

	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [filter, setFilter] = useState<Filter>({} as Filter);
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
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
	const [checkedFavorite, setCheckedFavorite] = useState<boolean | undefined>(
		publicationSelected.user.favorite_adoption_publications.includes(publicationSelected._id)
	);
	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useInfiniteQuery({
			queryKey: ['Adoption', filter],
			queryFn: async ({ pageParam = 1 }) => {
				const new_date = filter?.date ? new Date(filter?.date) : undefined;

				if (new_date) {
					new_date.setUTCHours(0, 0, 0, 0);
				}

				const response = await get<AdoptionPublicationScreen>(
					`adoptions/list?page_number=${pageParam}&page_size=${pageSize}${
						filter?.species ? '&species=' + filter.species : ''
					}${filter?.date ? '&date=' + new_date?.toISOString() : ''}${
						filter?.location ? '&location=' + filter?.location : ''
					}`
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

	const savePublicationAsFavoriteMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) => {
			return post('/user/add_favorite_adoption', data).then((response) => response.data);
		},
		onSuccess: () => {
			setCheckedFavorite(true);
			setUser({
				...user,
				favorite_adoption_publications: [
					...user.favorite_adoption_publications,
					publicationSelected._id
				]
			});
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const removePublicationFromFavoritesMutation = useMutation({
		mutationFn: (data: SaveOrRemoveFavoriteProps) =>
			del('/user/remove_favorite_adoption', { data: data }).then((response) => response.data),
		onSuccess: () => {
			setCheckedFavorite(false);
			setUser({
				...user,
				favorite_adoption_publications: user.favorite_adoption_publications.filter(
					(id) => id !== publicationSelected._id
				)
			});
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const handleOpenModal = (publication: AdoptionPublication) => {
		setCheckedFavorite(user.favorite_adoption_publications.includes(publication._id));
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
				onSaveAsFavorite={() => {
					savePublicationAsFavoriteMutation.mutate({
						user_id: publicationSelected.user._id ? publicationSelected.user._id : '',
						pub_id: publicationSelected._id
					});
				}}
				onRemoveFromFavorites={() => {
					removePublicationFromFavoritesMutation.mutate({
						user_id: publicationSelected.user._id ? publicationSelected.user._id : '',
						pub_id: publicationSelected._id
					});
				}}
				navBarHeight={tabBarHeight}
				checkedFavorite={checkedFavorite}
			/>
			<MemoizedFilterModal
				filter={filter}
				visible={visibleFilter}
				navBarHeight={tabBarHeight}
				handlerVisible={() => setVisibleFilter(false)}
				onApplyFilter={setFilter}
				handlerCancel={() => setFilter({} as Filter)}
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
				renderItem={({ item }) => <MemoizedAdoptionCard {...item} onOpenModal={handleOpenModal} />}
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
		</>
	);
}
