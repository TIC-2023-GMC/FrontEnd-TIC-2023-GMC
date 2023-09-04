import React, { useRef, useState, memo, useCallback, useContext } from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import { styles } from './ExperienceScreen.styles';
import { StatusBar } from 'expo-status-bar';
import { del, get, post } from '../../services/api';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import FilterModal from '../../components/ExperiencesFilterModal';
import {
	AddCommentProps,
	AddOrRemoveLikeProps,
	ExperienceFilter,
	ExperiencePublication
} from '../../models/InterfacesModels';
import ExperienceCard from '../../components/ExperienceCard';
import {
	getAddCommentEndpoint,
	getAddLikeEndpoint,
	getListExperiencesEnpoint,
	getRemoveLikeEndpoint
} from '../../services/endpoints';
import { UserContext, UserContextParams } from '../../auth/userContext';

interface ExperiencePublicationScreen {
	0: ExperiencePublication[];
	1: number;
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
	const { user } = useContext<UserContextParams>(UserContext);
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [filter, setFilter] = useState<ExperienceFilter>({} as ExperienceFilter);
	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
		useInfiniteQuery({
			queryKey: ['Experience', filter],
			queryFn: async ({ pageParam = 1 }) => {
				const newDate = filter?.date ? new Date(filter?.date) : undefined;

				if (newDate) {
					newDate.setUTCHours(0, 0, 0, 0);
				}

				const response = await get<ExperiencePublicationScreen>(
					getListExperiencesEnpoint({ pageParam, pageSize, filter, newDate })
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

	return (
		<>
			<StatusBar style="light" />
			<MemoizedFilterModal
				filter={filter}
				visible={visibleFilter}
				navBarHeight={tabBarHeight}
				handlerVisible={() => setVisibleFilter(false)}
				onApplyFilter={setFilter}
				handlerCancel={() => setFilter({} as ExperienceFilter)}
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
					<MemoizedExperienceCard
						{...item}
						userAccount={user}
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
export { ExperienceFilter };
