//import axios, { InternalAxiosRequestConfig } from "axios";
import axios from 'axios';
import Constants from 'expo-constants';

export const baseUrl = Constants.manifest?.extra?.apiUrl;
axios.defaults.baseURL = baseUrl;
export const { get, post, put, delete: del, patch } = axios;
