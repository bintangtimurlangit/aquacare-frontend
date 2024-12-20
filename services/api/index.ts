import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { API_CONFIG } from '../../config/api.config';

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('user');
            // Redirect to login
            router.push('/');
        }
        return Promise.reject(error);
    }
);

export default api;
