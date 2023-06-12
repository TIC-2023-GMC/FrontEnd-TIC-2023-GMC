import { ExpoConfig } from "@expo/config";
import 'dotenv/config';



const config: ExpoConfig = {
  name: "Test",
  version: "1.0.0",
  slug: "Test",
  extra: {
    apiUrl: process.env.API_URL
  },
};

export default config;
