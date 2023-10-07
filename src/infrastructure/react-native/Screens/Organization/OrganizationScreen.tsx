import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { container } from 'tsyringe';
import { ListOrganizationUseCase } from '../../../../application/hooks';
import OrganizationCard from '../../components/OrganizationCard';
import { styles } from './OrganizationScreen.styles';
import { useScrollToTop } from '@react-navigation/native';
const listOrganization = container.resolve(ListOrganizationUseCase);
export function OrganizationScreen() {
	const [visible, setVisible] = useState(false);
	const tabBarHeight = useBottomTabBarHeight();
	const ref = useRef<FlatList>(null);
	useScrollToTop(ref);
	const pageSize = 2;
	const { data, hasNextPage, fetchNextPage, refetch, isFetchingNextPage, isLoading, isFetching } =
		listOrganization.useQueryOrganization(pageSize);
	const handleLoadMore = () => {
		if (!isFetchingNextPage && hasNextPage && hasNextPage !== undefined) {
			fetchNextPage();
		}
	};

	return (
		<>
			<StatusBar style="light" />
			<FlatList
				style={{ ...styles.section, marginBottom: tabBarHeight }}
				testID="organization-list"
				keyExtractor={(item) => item._id}
				onEndReached={handleLoadMore}
				ref={ref}
				data={data?.pages.flatMap((page) => page[0])}
				renderItem={({ item }) => <OrganizationCard {...item} setError={setVisible} />}
				initialNumToRender={pageSize}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					hasNextPage ? (
						<View style={styles.activityIndicator}>
							<Text>No hay más organizaciones para mostrar</Text>
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
				visible={visible}
				onDismiss={() => setVisible(false)}
				duration={2000}
				style={{ marginBottom: tabBarHeight + 10 }}
			>
				Existió un error al abrir la red social
			</Snackbar>
		</>
	);
}
