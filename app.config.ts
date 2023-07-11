import { ExpoConfig } from '@expo/config';
import 'dotenv/config';

const config: ExpoConfig = {
	name: 'Pawsitive-Quito',
	version: '1.0.0',
	slug: 'PAWQ',
	extra: {
		envType: process.env.ENV_TYPE,
		apiLocalUrl: process.env.API_LOCAL_URL,
		apiRemoteUrl: process.env.API_REMOTE_URL
	}
};

export default config;
