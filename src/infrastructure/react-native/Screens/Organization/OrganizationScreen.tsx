import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import { container } from 'tsyringe';
import { ListOrganizationUseCase } from '../../../../application/hooks';
import { styles } from './OrganizationScreen.styles';
const listOrganization = container.resolve(ListOrganizationUseCase);
export function OrganizationScreen() {
	const ref = useRef<FlatList>(null);
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
				keyExtractor={(item) => item._id}
				onEndReached={handleLoadMore}
				ref={ref}
				data={data?.pages.flatMap((page) => page[0])}
				renderItem={({ item }) => (
					<View>
						<Text>{item.name}</Text>
					</View>
				)}
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
			/>
		</>
	);
}
