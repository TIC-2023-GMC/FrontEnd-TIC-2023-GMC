import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
	useScrollToTop
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useRef } from 'react';
import { BackHandler, FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { container } from 'tsyringe';
import { UserContext, UserContextParams } from '../../../../../application/auth/user.auth';
import {
	AddCommentUseCase,
	AddLikeUseCase,
	ListMyPublicationUseCase,
	RemoveLikeUseCase
} from '../../../../../application/hooks';
import { resetNavigationStack } from '../../../../../utils/utils';
import AdoptionCard from '../../../components/AdoptionCard';
import { styles } from './MyPublicationsScreen.styles';

const listMyPublications = container.resolve(ListMyPublicationUseCase);
const addLike = container.resolve(AddLikeUseCase);
const removeLike = container.resolve(RemoveLikeUseCase);
const addComment = container.resolve(AddCommentUseCase);

const MemoizedAdoptionCard = memo(AdoptionCard);

export function MyPublicationsScreen() {
	const theme = useTheme();
	const ref = useRef<FlatList>(null);
	const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
	const tabBarHeight = useBottomTabBarHeight();
	const { user, setUser } = useContext<UserContextParams>(UserContext);

	const pageSize = 2;
	useScrollToTop(ref);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch, isFetching } =
		listMyPublications.userQueryMyPublications(pageSize, user._id ?? '');

	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};

	useFocusEffect(
		useCallback(() => {
			const handleBackPress = () => {
				if (navigation.isFocused()) {
					resetNavigationStack(navigation, 'Perfil');
					return true;
				}
				return false;
			};
			BackHandler.addEventListener('hardwareBackPress', handleBackPress);
			return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		}, [])
	);

	const { addLikeMutation } = addLike.useMutationAddLike('MyPublications');
	const { removeLikeMutation } = removeLike.useMutationRemoveLike('MyPublications');

	const { addCommentMutation } = addComment.useMutationAddComment();

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
					<MemoizedAdoptionCard
						{...item}
						setUserAccount={setUser}
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
