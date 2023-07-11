//import axios, { InternalAxiosRequestConfig } from "axios";
import axios from 'axios';
import Constants from 'expo-constants';
const extra = Constants.manifest?.extra;
const baseUrl = extra?.apiLocalUrl === '' ? extra.apiLocalUrl : extra?.apiRemoteUrl;
axios.defaults.baseURL = baseUrl;
export const { get, post, put, delete: del, patch } = axios;
