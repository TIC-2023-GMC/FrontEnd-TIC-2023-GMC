import React, { useRef, useState, memo } from 'react';
import { Text, View, FlatList } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import PublicationCard from '../../components/PublicationCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/FilterModal';
import { AdoptionPublication } from '../../models/InterfacesModels';

interface AdoptionPublicationScreen {
	0: AdoptionPublication[];
	1: number;
}
export interface Filter {
	species: string | undefined;
	date: Date | undefined;
	location: string | undefined;
}
function formatDate(date: Date): string {
	if (!date) {
		return '';
	} else {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date?.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
}
const MemoizedPublicationCard = memo(PublicationCard);
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
	const [empty, setEmpty] = useState<boolean>(false);
	const [filter, setFilter] = useState<Filter>({} as Filter);
	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['Adoption', filter],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await get<AdoptionPublicationScreen>(
				`adoptions/adoptions?page_number=${pageParam}&page_size=${pageSize}${
					filter?.species ? '&species=' + filter.species : ''
				}${filter?.date ? '&date=' + formatDate(filter?.date) : ''}${
					filter?.location ? '&location=' + filter?.location : ''
				}`
			);
			return response.data;
		},
		getNextPageParam: (lastPage) => lastPage[1],
		refetchOnWindowFocus: true,
		enabled: !!filter
	});

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && !empty) {
			fetchNextPage();
		} else {
			setEmpty(true);
		}
	};

	return isLoading ? (
		<View style={styles.container}>
			<ActivityIndicator animating={true} size="large" />
			<Text style={{ marginTop: 10 }}>Cargando</Text>
		</View>
	) : (
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
				renderItem={({ item }) => <MemoizedPublicationCard {...item} />}
				initialNumToRender={pageSize}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					!empty ? (
						<View style={styles.activityIndicator}>
							<Text>No hay más publicaciones</Text>
						</View>
					) : null
				}
				ListFooterComponent={
					!empty ? (
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
