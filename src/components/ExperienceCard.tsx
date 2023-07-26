/* eslint-disable react-native/no-unused-styles */
import * as React from 'react';
import { useState } from 'react';
import {
	StyleSheet,
	View,
	Image,
	TextLayoutEventData,
	NativeSyntheticEvent
} from 'react-native';
import { Button, Card, useTheme, Text, IconButton, List } from 'react-native-paper';
import { ExperiencePublication } from '../models/InterfacesModels';

const LeftContent = (props: { size: number; photo: string }) => (
	<Image
		source={{ uri: props.photo }}
		resizeMode="cover"
		resizeMethod="auto"
		style={{ borderRadius: 25, width: props.size + 10, height: props.size + 10 }}
	/>
);

const ExperienceCard = (props: ExperiencePublication) => {
	const theme = useTheme();
	const [like, setLike] = useState<boolean>();
	const { user, description, publication_date: publicationDate, photo } = props;
	const [expanded, setExpanded] = useState<boolean>();
	const [isTruncated, setIsTruncated] = useState<boolean>(false);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const handleTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
		const { lines } = event.nativeEvent;
		if (lines.length > 2) {
			setIsTruncated(true);
		} else {
			setIsTruncated(false);
		}
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
				<List.Item
					style={styles.list}
					titleStyle={styles.title}
					title={'Mi experiencia'}
					left={() => <List.Icon color={theme.colors.tertiary} icon="account-heart" />}
				/>
				<Text
					style={styles.description}
					numberOfLines={expanded ? undefined : 2}
					onTextLayout={handleTextLayout}
				>
					{description}
				</Text>
			</Card.Content>

			<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
				<View style={styles.actionMore}>
					<Button mode="text" onPress={handleExpand} disabled={!isTruncated}>
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
		flexGrow: 1,
		width: '95%',
		borderRadius: 10,
		backgroundColor: 'white',
		marginTop: 15
	},
	content: {
		//flexDirection: 'row',
		marginTop: 10,
		paddingHorizontal: 15,
		justifyContent: 'space-between'
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
	title: {
		fontSize: 16,
		fontWeight: '700'
	},
	description: {
		fontSize: 15,
		textAlign: 'justify'
	},
	list: {
		paddingVertical: 0,
		paddingRight: 0,
		marginVertical: 0
	}
});
export default ExperienceCard;
