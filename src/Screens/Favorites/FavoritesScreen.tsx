import React, { useRef, useState, memo, useCallback } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './FavoritesScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get, post } from '../../services/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import AdoptionCard from '../../components/AdoptionCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/AdoptionsFilterModal';
import { AdoptionPublication } from '../../models/InterfacesModels';
import { useFocusEffect } from '@react-navigation/native';
import MoreOptionsModal from '../../components/MoreOptionsModal';
import { Filter } from '../Adoption';

interface FavoritesScreen {
	0: AdoptionPublication[];
	1: number;
}

interface RemoveFromFavoriteProps {
	userId: string;
	publicationId: string;
}

const MemoizedAdoptionCard = memo(AdoptionCard);
const MemoizedMoreOptionsModal = memo(MoreOptionsModal);

export function FavoritesScreen() {

	const [filter, setFilter] = useState<Filter>({} as Filter);


	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);

	//The publiation by default is just to not initialize it as undefined
	const [publicationSelected, setPublicationSelected] = useState<AdoptionPublication>({
		_id: '',
		user: {
			first_name: 'Test',
			last_name: 'Test',
			mobile_phone: '0983473043',
			neighborhood: 'Cumbayá',
			email: 'gandhygarcia@outlook.es',
			password: 'password123',
			num_previous_pets: 2,
			num_current_pets: 1,
			outdoor_hours: 6,
			house_space: 100,
			has_yard: false,
			main_pet_food: 'homemade',
			pet_expenses: 40.5,
			motivation: 'Love for animals',
			favorite_adoption_publications: [],
			photo: {
				_id: '2',
				img_path:
					'https://scontent.fgye1-1.fna.fbcdn.net/v/t1.6435-9/74242360_3195954163812838_4274861617784553472_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFRCjYsTZuQlf2PHyTPJ3HYymegSJbxrSjKZ6BIlvGtKPYIzlm5LEqBr9cR0tDl-FEvtHfkBqZQ6LHCgw-pkTlW&_nc_ohc=dye6H3TWD6QAX-v2xOF&_nc_ht=scontent.fgye1-1.fna&oh=00_AfCF85oDfvg1CEtIJ1We_mJ3gV49fRwyklxfDfl8SouHOA&oe=64D84DE2'
			}
		},
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
				const favoriteAdoptionPublications: string[] = [
					'64c304097f723d556764fa0b',
					'64c304097f723d556764fa0a'
				];

				const response = await post<FavoritesScreen>(
					`/user/list_favorite_adoptions?page_number=${pageParam}&page_size=${pageSize}`,
					favoriteAdoptionPublications
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

	const removePublicationFromeFavoritesMutation = useMutation({
		mutationFn: (data: RemoveFromFavoriteProps) =>
			post('/user/add_favorite', data).then((response) => response.data),
		onSuccess: () => {
			refetch();
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
				publication={publicationSelected!}
				visible={isMoreModalVisible}
				handlerVisible={() => setIsMoreModalVisible(false)}
				onSaveAsFavorite={() => {
					//savePublicationAsFavoriteMutation.mutate(({userId, publicationId: publicationSelected?._id});
					console.log('saved as favorite');
				}}
				onRemoveFromFavorites={() => {
					/* removePublicationFromFavoritesMutation.mutate({
						userId,
						publicationId: publicationSelected?._id
					}); */
					console.log('removed from favorites');
					
				}}
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
				renderItem={({ item }) => <MemoizedAdoptionCard {...item} onOpenModal={handleOpenModal}/>}
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
