import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, List, Text } from 'react-native-paper';
import { Organization } from '../../../domain/models/InterfacesModels';
import { handleOpenURL } from '../../../utils/utils';

function OrganizationCard(organization: Organization & { setError: (_error: boolean) => void }) {
	const {
		organization_photo: photo,
		organization_name: name,
		organization_description: description,
		external_links,
		setError
	} = organization;
	const iconSize = 28;
	return (
		<Card style={styles.card}>
			<Card.Cover
				theme={{ roundness: 0.5 }}
				style={{
					borderTopLeftRadius: 12,
					borderTopRightRadius: 12
				}}
				source={{
					uri: photo.img_path
				}}
			/>
			<Card.Content style={styles.content}>
				<List.Item
					style={styles.list}
					title={name}
					titleNumberOfLines={2}
					titleStyle={styles.title}
					left={({ color }) => <List.Icon color={color} icon="dog-service" />}
				/>
				<Text style={styles.description}>{description}</Text>
				<View style={styles.socialButtons}>
					{external_links.facebook && (
						<IconButton
							icon="facebook"
							size={iconSize}
							onPress={() => handleOpenURL(external_links.facebook, setError)}
						/>
					)}
					{external_links.instagram && (
						<IconButton
							icon="instagram"
							size={iconSize}
							onPress={() => handleOpenURL(external_links.instagram, setError)}
						/>
					)}
					{external_links.twitter && (
						<IconButton
							icon="twitter"
							size={iconSize}
							onPress={() => handleOpenURL(external_links.twitter, setError)}
						/>
					)}
					{external_links.website && (
						<IconButton
							icon="web"
							size={iconSize}
							onPress={() => handleOpenURL(external_links.website, setError)}
						/>
					)}
				</View>
			</Card.Content>
		</Card>
	);
}
const styles = StyleSheet.create({
	card: {
		justifySelf: 'flex-start',
		alignSelf: 'center',
		height: 'auto',
		width: '95%',
		backgroundColor: 'white',
		marginTop: 15
	},
	list: {
		paddingVertical: 0,
		paddingRight: 0,
		marginVertical: 0
	},
	content: {
		marginTop: 10,
		paddingHorizontal: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	description: {
		fontSize: 15,
		textAlign: 'justify',
		justifyContent: 'center'
	},
	socialButtons: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingVertical: 0,
		paddingHorizontal: 0,
		gap: 10
	}
});

export default memo(OrganizationCard);
