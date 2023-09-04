import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useRef } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { UserContext, UserContextParams } from '../../../auth/userContext';
import AdoptionCard from '../../../components/AdoptionCard';
import { AdoptionPublication } from '../../../models/InterfacesModels';
import { get } from '../../../services/api';
import { getMyPublicationsEndpoint } from '../../../services/endpoints';
import { styles } from './MyPublicationsScreen.styles';

interface MyPublicationsScreenValues {
	0: AdoptionPublication[];
	1: number;
}

const MemoizedAdoptionCard = memo(AdoptionCard);

export function MyPublicationsScreen() {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const { user, setUser } = useContext<UserContextParams>(UserContext);

	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useInfiniteQuery({
			queryKey: ['MyPublicationsScreen'],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await get<MyPublicationsScreenValues>(
					getMyPublicationsEndpoint({ pageParam, pageSize, user_id: user._id ? user._id : '' })
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
					<MemoizedAdoptionCard {...item} setUserAccount={setUser} userAccount={user} />
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
		</>
	);
}
