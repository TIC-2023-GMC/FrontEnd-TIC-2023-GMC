import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Comment } from '../models/InterfacesModels';
import { Card, MD3Theme, Text, useTheme } from 'react-native-paper';

export const CommentComponent = ({ user, comment_date, comment_text }: Comment) => {
	const theme = useTheme();
	const styles = createStyles(theme);
	return (
		<Card style={styles.container}>
			<Card.Title
				title={user.first_name + ' ' + user.last_name}
				subtitle={
					<Text style={{ color: theme.colors.tertiary }}>
						{'Publicado el ' +
							new Date(comment_date).toLocaleString('es-ES', {
								timeZone: 'America/Guayaquil',
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: false,
								hourCycle: 'h23'
							})}
					</Text>
				}
				left={(props) => (
					<Image
						source={{ uri: user.photo.img_path }}
						resizeMode="cover"
						resizeMethod="auto"
						style={{ borderRadius: 25, width: props.size, height: props.size }}
					/>
				)}
			/>
			<Card.Content>
				<Text style={styles.text}>{comment_text}</Text>
			</Card.Content>
		</Card>
	);
};

const createStyles = (theme: MD3Theme) =>
	StyleSheet.create({
		container: {
			margin: 3
		},
		user: {
			fontWeight: 'bold',
			fontSize: 16
		},
		text: {
			marginTop: 2,
			fontSize: 14
		},
		date: {
			marginTop: 2,
			fontSize: 12,
			color: theme.colors.tertiary
		}
	});
