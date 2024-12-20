import api from './index';
import { AuthResponse, LoginCredentials, RegisterData } from '../../types/auth';
import { ApiResponse } from '../../types/api';
import * as SecureStore from 'expo-secure-store';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('🔄 Making login request to:', `${api.defaults.baseURL}/api/auth/login`);
      console.log('📤 Login payload:', { email: credentials.email }); // Don't log password
      
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🔄 Making registration request to:', `${api.defaults.baseURL}/api/auth/register`);
      const response = await api.post<ApiResponse<AuthResponse>>('api/auth/register', data);
      console.log('✅ Registration API response:', response.data);
      
      if (!response.data.success) {
        console.error('❌ Registration failed:', response.data.error);
        throw new Error(response.data.error || 'Registration failed');
      }
      
      return response.data.data!;
    } catch (error: any) {
      console.error('❌ Registration request failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  },

  logout: async () => {
    await api.post('api/auth/logout');
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  }
};
