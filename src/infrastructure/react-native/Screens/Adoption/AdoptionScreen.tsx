import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, Snackbar, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../application/auth/userContext';
import {
	ListAdoptionsUseCase,
	useFavorite,
	useLike,
	useMutationComment
} from '../../../../application/hooks';
import { AdoptionFilter, AdoptionPublication } from '../../../../domain/models/InterfacesModels';
import AdoptionCard from '../../components/AdoptionCard';
import FilterModal from '../../components/AdoptionsFilterModal';
import MoreOptionsModal from '../../components/MoreOptionsModal';
import { styles } from './AdoptionScreen.styles';

const listAdoption = container.resolve(ListAdoptionsUseCase);
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
	const pageSize = 2;
	const theme = useTheme();

	const { addCommentMutation } = useMutationComment();
	const [visibleSnackBar, setVisibleSnackBar] = useState([false, false]);
	const ref = useRef<FlatList>(null);
	const tabBarHeight = useBottomTabBarHeight();
	const [filter, setFilter] = useState<AdoptionFilter>({} as AdoptionFilter);
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
	const [publicationSelected, setPublicationSelected] = useState<AdoptionPublication | undefined>(
		undefined
	);
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
		listAdoption.useQueryAdoption(filter, pageSize);
	const { user, setUser } = useContext<UserContextParams>(UserContext);
	const { savePublicationAsFavoriteMutation, removePublicationFromFavoritesMutation } =
		useFavorite(setVisibleSnackBar);
	const { addLikeMutation, removeLikeMutation } = useLike('Adoption');
	useScrollToTop(ref);

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

	const handleOpenModal = (publication: AdoptionPublication) => {
		setPublicationSelected(publication);
		setIsMoreModalVisible(true);
	};

	return (
		<>
			<StatusBar style="light" />
			{publicationSelected && (
				<MemoizedMoreOptionsModal
					publication={publicationSelected}
					modalVisible={isMoreModalVisible}
					handleModalVisible={() => setIsMoreModalVisible(false)}
					navBarHeight={tabBarHeight}
				/>
			)}
			<MemoizedFilterModal
				filter={filter}
				visible={visibleFilter}
				navBarHeight={tabBarHeight}
				handlerVisible={() => setVisibleFilter(false)}
				onApplyFilter={setFilter}
				handlerCancel={() => setFilter({} as AdoptionFilter)}
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
						onSaveAsFavorite={savePublicationAsFavoriteMutation.mutate}
						onRemoveFromFavorites={removePublicationFromFavoritesMutation.mutate}
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
			<Snackbar
				theme={theme}
				visible={visibleSnackBar[0]}
				onDismiss={() => setVisibleSnackBar([false, false])}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación guardada en favoritos
			</Snackbar>
			<Snackbar
				theme={theme}
				visible={visibleSnackBar[1]}
				onDismiss={() => setVisibleSnackBar([false, false])}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Publicación eliminada de favoritos
			</Snackbar>
		</>
	);
}
export { AdoptionFilter };
