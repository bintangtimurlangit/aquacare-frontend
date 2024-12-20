import api from './index';
import { AxiosError } from 'axios';

export const healthAPI = {
    check: async () => {
        try {
            const response = await api.get('/health');
            console.log('🟢 Backend connection successful:', response.data);
            return true;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('🔴 Backend connection failed:', axiosError.message);
            return false;
        }
    }
}; 