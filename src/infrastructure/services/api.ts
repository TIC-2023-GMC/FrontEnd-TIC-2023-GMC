//import axios, { InternalAxiosRequestConfig } from "axios";
import axios from 'axios';
import Constants from 'expo-constants';
const extra = Constants.expoConfig?.extra;
export const baseUrl = extra?.envType === 'LOCAL' ? extra.apiLocalUrl : extra?.apiRemoteUrl;
axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;
export const { get, post, put, delete: del, patch } = axios;
