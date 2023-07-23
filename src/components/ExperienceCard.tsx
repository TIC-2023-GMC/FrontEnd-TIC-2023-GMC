/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Card, useTheme, Text, IconButton, List } from 'react-native-paper';
import { AdoptionPublication } from '../InterfacesModels';

const LeftContent = (props: { size: number; photo: string }) => (
	<Image
		source={{ uri: props.photo }}
		resizeMode="cover"
		resizeMethod="auto"
		style={{ borderRadius: 25, width: props.size + 10, height: props.size + 10 }}
	/>
);

const ExperienceCard = (props: AdoptionPublication) => {
	const theme = useTheme();
	const [like, setLike] = useState<boolean>();
	const [expanded, setExpanded] = useState<boolean>();
	const {
		user,
		description,
		publication_date: publicationDate,
		photo
	} = props;
	const handleExpand = () => {
		setExpanded(!expanded);
	};
	return (
		<Card style={styles.card}>
			<Card.Title
				title={user.first_name + ' ' + user.last_name}
				subtitle={
					<Text style={{ color: theme.colors.tertiary }}>{'Publicado el ' + publicationDate}</Text>
				}
				left={(props) => <LeftContent {...props} photo={user.photo.img_path} />}
			/>
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
						title={'Mi experiencia'}
					/>

					<List.Item
						style={styles.list}
						title={'Esterilización'}
					/>
				</View>
                <Text> {description} </Text>
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
export default ExperienceCard;
