import React, { useRef, useState, memo, useCallback } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import AdoptionCard from '../../components/AdoptionCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/AdoptionsFilterModal';
import { AdoptionPublication } from '../../models/InterfacesModels';
import { useFocusEffect } from '@react-navigation/native';

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

export function AdoptionScreen({
	visibleFilter,
	setVisibleFilter
}: {
	visibleFilter: boolean;
	// eslint-disable-next-line no-unused-vars
	setVisibleFilter: (visible: boolean) => void;
}) {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [filter, setFilter] = useState<Filter>({} as Filter);
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

	return (
		<>
			<StatusBar style="light" />
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
				renderItem={({ item }) => <MemoizedAdoptionCard {...item} />}
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
