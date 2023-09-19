import { ExpoConfig } from '@expo/config';
import 'dotenv/config';

const config: ExpoConfig = {
	name: 'Pawsitive-Quito',
	slug: 'PAWQ',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './src/assets/icon.png',
	userInterfaceStyle: 'light',
	splash: {
		image: './src/assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './src/assets/adaptive-icon.png',
			backgroundColor: '#ffffff'
		}
	},
	web: {
		favicon: './src/assets/favicon.png'
	},
	updates: {
		fallbackToCacheTimeout: 0,
		useClassicUpdates: true
	},
	extra: {
		eas: {
			projectId: 'e60e9442-4acd-4c46-9eef-592cee8b408a'
		},
		envType: process.env.EXPO_PUBLIC_ENV_TYPE,
		apiLocalUrl: process.env.EXPO_PUBLIC_API_LOCAL_URL,
		apiRemoteUrl: process.env.EXPO_PUBLIC_API_REMOTE_URL
	}
};

export default config;
