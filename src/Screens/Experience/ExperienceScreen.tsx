import React, { useRef, useState, memo, useCallback } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './ExperienceScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/ExperiencesFilterModal';
import { ExperiencePublication } from '../../models/InterfacesModels';
import ExperienceCard from '../../components/ExperienceCard';

interface ExperiencePublicationScreen {
	0: ExperiencePublication[];
	1: number;
}
export interface Filter {
	species: string | undefined;
	date: Date | undefined;
}

const MemoizedExperienceCard = memo(ExperienceCard);
const MemoizedFilterModal = memo(FilterModal);

export function ExperienceScreen({
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
			queryKey: ['Experience', filter],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await get<ExperiencePublicationScreen>(
					`experiences/list?page_number=${pageParam}&page_size=${pageSize}${
						filter?.species ? '&species=' + filter.species : ''
					}${
						filter?.date
							? '&date=' +
								filter?.date.toLocaleString('es-ES', {
									timeZone: 'America/Guayaquil',
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit'
								})
							: ''
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
				renderItem={({ item }) => <MemoizedExperienceCard {...item} />}
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
