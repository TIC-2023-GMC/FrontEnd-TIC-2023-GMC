import React, { useRef, useState } from 'react';
import { ScrollView, Text, View, FlatList } from 'react-native';
import { styles } from './AdoptionScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { get } from '../../services/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import PublicationCard from '../../components/PublicationCard';
import { useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/FilterModel';
import { AdoptionPublication } from '../../InterfacesModels';

interface AdoptionScreen {
	0: AdoptionPublication[];
	1: number;
}

export function AdoptionScreen({
	visibleFilter,
	setVisibleFilter
}: {
	visibleFilter: boolean;
	setVisibleFilter: (visible: boolean) => void;
}) {
	const theme = useTheme();

	const ref = useRef<FlatList>(null);

	const tabBarHeight = useBottomTabBarHeight();

	useScrollToTop(ref);

	const [empty, setEmpty] = useState<boolean>(false);
	// const [data, setData] = useState<AdoptionPublication[]>();
	const pageSize = 2;
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
		['Adoption'],
		async ({ pageParam = 1 }) => {
			const response = await get<AdoptionScreen>(
				`adoptions/adoptions?page_number=${pageParam}&page_size=${pageSize}`
			);
			return response.data;
		},
		{
			getNextPageParam: (lastPage) => lastPage[1]
		}
	);

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
			<FilterModal
				visible={visibleFilter}
				navBarHeight={tabBarHeight}
				handlerVisible={() => setVisibleFilter(false)}
			/>
			<FlatList
				style={{
					...styles.section,
					marginBottom: tabBarHeight,
					backgroundColor: theme.colors.secondary
				}}
				onEndReached={handleLoadMore}
				ref={ref}
				data={data?.pages.flatMap((page) => page[0])}
				renderItem={({ item }) => <PublicationCard {...item} />}
				initialNumToRender={pageSize}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					<View style={styles.activityIndicator}>
						<Text>No hay más publicaciones</Text>
					</View>
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
