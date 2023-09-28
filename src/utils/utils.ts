import { CommonActions, NavigationProp } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { RefObject } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export function parseNumber(value: string) {
	const valueNumber = parseInt(value);
	if (isNaN(valueNumber)) {
		return '';
	}
	return valueNumber;
}

const snapShot = async (ref: RefObject<View>) => {
	try {
		return await captureRef(ref, {
			format: 'png',
			result: 'tmpfile'
		});
	} catch (error) {
		console.log(error);
	}
};
const shareImage = async (uri: string) => {
	try {
		await Sharing.shareAsync(uri);
	} catch (error) {
		console.log(error);
	}
};

export const snapShotAndShare = async (ref: RefObject<View>) => {
	await shareImage((await snapShot(ref)) || '');
};

export const resetNavigationStack = (
	navigation: NavigationProp<ReactNavigation.RootParamList>,
	route: string
) => {
	navigation.dispatch(
		CommonActions.reset({
			index: 0,
			routes: [{ name: route }]
		})
	);
};
