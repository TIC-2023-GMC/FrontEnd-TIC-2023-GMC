import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import ExperienceCard from '../../components/ExperienceCard';
import FilterModal from '../../components/ExperiencesFilterModal';

import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/user.auth';
import { ListExperiencesUseCase, useLike, useMutationComment } from '../../../../application/hooks';
import { ExperienceFilter } from '../../../../domain/models/InterfacesModels';
import { styles } from './ExperienceScreen.styles';

const MemoizedExperienceCard = memo(ExperienceCard);
const MemoizedFilterModal = memo(FilterModal);
const listExperience = container.resolve(ListExperiencesUseCase);
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

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
		listExperience.useQueryExperience(filter, pageSize);

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
	useEffect(() => {
		refetch();
	}, [filter]);

	const { addLikeMutation, removeLikeMutation } = useLike('Experience');
	const { addCommentMutation } = useMutationComment();

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
						refreshing={isFetchingNextPage || isLoading || isFetching}
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
