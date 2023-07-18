/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, useTheme, Text, Avatar, IconButton, List } from 'react-native-paper';
import { AdoptionPublication } from '../InterfacesModels';

const LeftContent = (props: { size: number }) => <Avatar.Icon {...props} icon="account" />;

const PublicationCard = (props: AdoptionPublication) => {
	const theme = useTheme();
	const [like, setLike] = useState<boolean>();
	const [expanded, setExpanded] = useState<boolean>();
	const {
		pet_age: petAge,
		pet_size: petSize,
		description,
		pet_location: petLocation,
		publication_date: publicationDate,
		photo,
		pet_sex: petSex,
		vaccination_card: vaccinationCard,
		sterilized
	} = props;
	const handleExpand = () => {
		setExpanded(!expanded);
	};
	return (
		<Card style={styles.card}>
			<Card.Title
				title="Erick Munoz"
				subtitle={
					<Text style={{ color: theme.colors.tertiary }}>{'Publicado el ' + publicationDate}</Text>
				}
				left={LeftContent}
				right={() => <IconButton icon="dots-vertical" onPress={() => console.log('show menu')} />}
			/>
			<View></View>

			<Card.Cover
				theme={{ ...theme, roundness: 0.5 }}
				style={styles.img}
				resizeMode="contain"
				resizeMethod="scale"
				source={{ uri: photo.img_path }}
				loadingIndicatorSource={{ uri: photo.img_path }}
				progressiveRenderingEnabled={true}
			/>
			<Card.Content style={styles.content}>
				<View style={styles.contentColumn}>
					<List.Item
						style={styles.list}
						title={
							petAge * 12 >= 12
								? Math.round(petAge) > 1
									? Math.round(petAge) + ' años'
									: Math.round(petAge) + ' año'
								: petAge * 12 + ' meses'
						}
						left={() => <List.Icon color={theme.colors.tertiary} icon="cake-variant" />}
					/>
					<List.Item
						style={styles.list}
						titleNumberOfLines={2}
						title={petLocation}
						left={() => <List.Icon color={theme.colors.tertiary} icon="map-marker" />}
					/>
					<List.Item
						style={styles.list}
						title={petSize}
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
								icon={`gender-${petSex ? 'male' : 'female'}`}
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
								icon={`${vaccinationCard ? 'check-circle-outline' : 'close-circle-outline'}`}
							/>
						)}
					/>
					<List.Item
						style={styles.list}
						title={'Esterilización'}
						left={() => (
							<List.Icon
								color={theme.colors.tertiary}
								icon={`${sterilized ? 'check-circle-outline' : 'close-circle-outline'}`}
							/>
						)}
					/>
				</View>
			</Card.Content>
			{expanded && (
				<Card.Content>
					<List.Item style={styles.list} title="Descripción" description={description} />
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
