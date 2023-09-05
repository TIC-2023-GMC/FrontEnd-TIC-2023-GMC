import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
	useScrollToTop
} from '@react-navigation/native';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useContext, useRef } from 'react';
import { BackHandler, FlatList, RefreshControl, Text, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { UserContext, UserContextParams } from '../../../auth/userContext';
import AdoptionCard from '../../../components/AdoptionCard';
import {
	AddCommentProps,
	AddOrRemoveLikeProps,
	AdoptionPublication
} from '../../../models/InterfacesModels';
import { del, get, post } from '../../../services/api';
import {
	getAddCommentEndpoint,
	getAddLikeEndpoint,
	getMyPublicationsEndpoint,
	getRemoveLikeEndpoint
} from '../../../services/endpoints';
import { styles } from './MyPublicationsScreen.styles';
import { resetNavigationStack } from '../../../utils/utils';

interface MyPublicationsScreenValues {
	0: AdoptionPublication[];
	1: number;
}

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
		onSuccess: () => {
			refetch();
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
		onSuccess: () => {
			refetch();
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
