/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, useTheme, Text, Avatar, IconButton, List } from 'react-native-paper';

const LeftContent = (props: { size: number }) => <Avatar.Icon {...props} icon="account" />;

const PublicationCard = () => {
	const theme = useTheme();
	const [like, setLike] = useState<boolean>();
	const [expanded, setExpanded] = useState<boolean>();
	const petSex = 'M';
	const carnet = true;
	const sterilization = true;
	const handleExpand = () => {
		setExpanded(!expanded);
	};
	return (
		<Card style={styles.card}>
			<Card.Title
				title="Erick Munoz"
				subtitle={<Text style={{ color: theme.colors.tertiary }}>Publicado el 11/07/2023</Text>}
				left={LeftContent}
				right={() => <IconButton icon="dots-vertical" onPress={() => console.log('show menu')} />}
			/>
			<View></View>

			<Card.Cover
				theme={{ ...theme, roundness: 0.5 }}
				style={styles.img}
				resizeMode="contain"
				resizeMethod="scale"
				source={{ uri: 'https://tecolotito.elsiglodetorreon.com.mx/i/2007/09/27171.jpeg' }}
				loadingIndicatorSource={{
					uri: 'https://tecolotito.elsiglodetorreon.com.mx/i/2007/09/27171.jpeg'
				}}
				progressiveRenderingEnabled={true}
			/>
			<Card.Content style={styles.content}>
				<View style={styles.contentColumn}>
					<List.Item
						style={styles.list}
						title={'3 años'}
						left={() => <List.Icon color={theme.colors.tertiary} icon="cake-variant" />}
					/>
					<List.Item
						style={styles.list}
						titleNumberOfLines={2}
						title={'San Antonio de Pichincha'}
						left={() => <List.Icon color={theme.colors.tertiary} icon="map-marker" />}
					/>
					<List.Item
						style={styles.list}
						title={'Pequeño'}
						left={() => <List.Icon color={theme.colors.tertiary} icon="ruler" />}
					/>
				</View>
				<View style={styles.contentColumn}>
					<List.Item
						style={styles.list}
						title={'Sexo'}
						left={() => (
							<List.Icon
								color={theme.colors.tertiary}
								icon={`gender-${'M' === petSex ? 'male' : 'female'}`}
							/>
						)}
					/>
					<List.Item
						style={styles.list}
						titleNumberOfLines={2}
						title={'Carnet de Vacunación'}
						left={() => (
							<List.Icon
								color={theme.colors.tertiary}
								icon={`${carnet ? 'check-circle-outline' : 'close-circle-outline'}`}
							/>
						)}
					/>
					<List.Item
						style={styles.list}
						title={'Esterilización'}
						left={() => (
							<List.Icon
								color={theme.colors.tertiary}
								icon={`${sterilization ? 'check-circle-outline' : 'close-circle-outline'}`}
							/>
						)}
					/>
				</View>
			</Card.Content>
			{expanded && (
				<Card.Content>
					<List.Item
						style={styles.list}
						title="Descripción"
						description={'Se llama Atom y es jugueton, es alérgico a las fresas. Recién operado'}
					/>
				</Card.Content>
			)}

			<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
				<View style={styles.actionMore}>
					<Button mode="text" onPress={handleExpand}>
						{expanded ? 'Ver menos' : 'Ver más'}
					</Button>
				</View>
				<View style={styles.actionsContainer}>
					<View style={styles.actions}>
						<IconButton
							animated={true}
							size={28}
							icon="heart"
							iconColor={!like ? theme.colors.tertiary : theme.colors.primary}
							onPress={() => setLike(!like)}
						/>
					</View>
					<View style={styles.actions}>
						<IconButton
							size={28}
							icon="comment"
							iconColor={theme.colors.tertiary}
							onPress={() => console.log('Pressed')}
						/>
					</View>

					<View style={styles.actions}>
						<IconButton
							size={28}
							icon="share-variant"
							iconColor={theme.colors.tertiary}
							onPress={() => console.log('Pressed')}
						/>
					</View>
				</View>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	img: {
		width: '100%',
		borderRadius: 0
	},
	card: {
		justifySelf: 'flex-start',
		alignSelf: 'center',
		height: 'auto',
		width: '95%',
		borderRadius: 10,
		backgroundColor: 'white',
		marginTop: 15
	},
	contentColumn: {
		width: '50%',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	content: {
		flexDirection: 'row',
		marginTop: 10,
		paddingHorizontal: 15,
		justifyContent: 'space-between',
		gap: 20
	},
	actionsContainer: {
		padding: 0,
		marginTop: 0,
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	actions: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 0,
		borderRadius: 0,
		padding: 0,
		width: 45
	},
	actionMore: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	list: {
		paddingVertical: 0,
		paddingRight: 0,
		marginVertical: 0
	}
});
export default PublicationCard;
