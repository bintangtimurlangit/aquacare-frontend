import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = '172.21.196.214:4000';

// Create axios instance with default config
const api = axios.create({
    baseURL: `http://${BASE_URL}/api`,
});

// Add token to requests if it exists
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: async (username, password) => {
        const response = await api.post('/users/login', { username, password });
        return response.data;
    },

    register: async (username, password) => {
        const response = await api.post('/users/register', { username, password });
        return response.data;
    }
};

export const deviceAPI = {
    getUserDevices: async () => {
        const response = await api.get('/devices/user-devices');
        return response.data;
    },

    // Add other device-related API calls here
}; 