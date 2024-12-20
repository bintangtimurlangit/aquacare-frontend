import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types/api';
import * as SecureStore from 'expo-secure-store';

export interface FeedingSchedule {
    id: string;
    deviceId: string;
    time: string;
    days: string;
    isActive: boolean;
    createdAt: string;
}

export interface FeedingHistory {
    id: string;
    deviceId: string;
    feedTime: string;
    type: 'scheduled' | 'manual';
    success: boolean;
}

class FeedingService {
    private static async getAuthHeader() {
        const token = await SecureStore.getItemAsync('token');
        console.log('Auth Token:', token ? 'Present' : 'Missing');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }

    static async getSchedules(deviceId: string): Promise<ApiResponse<FeedingSchedule[]>> {
        try {
            console.log('Getting schedules for device:', deviceId);
            
            // Try to get from local storage first
            const stored = await AsyncStorage.getItem(`feeding_schedules_${deviceId}`);
            if (stored) {
                console.log('Found stored schedules');
                return JSON.parse(stored);
            }

            // If not in storage, fetch from API
            const config = await this.getAuthHeader();
            console.log('Fetching schedules from API...');
            console.log('Request URL:', `/api/devices/${deviceId}/feeding/schedule`);
            console.log('Request Config:', JSON.stringify(config));
            
            const response = await api.get(`/api/devices/${deviceId}/feeding/schedule`, config);
            console.log('API Response:', response.data);
            
            // Store the response
            await AsyncStorage.setItem(
                `feeding_schedules_${deviceId}`,
                JSON.stringify(response.data)
            );

            return response.data;
        } catch (error: any) {
            console.error('Error getting schedules:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                config: error.config
            });
            throw error;
        }
    }

    static async createSchedule(deviceId: string, schedule: {
        time: string;
        days: string;
        isActive?: boolean;
    }): Promise<ApiResponse<FeedingSchedule>> {
        try {
            console.log('Creating schedule:', {
                deviceId,
                schedule
            });
            
            const config = await this.getAuthHeader();
            console.log('Request URL:', `/api/devices/${deviceId}/feeding/schedule`);
            console.log('Request Data:', schedule);
            console.log('Request Config:', JSON.stringify(config));
            
            const response = await api.post(
                `/api/devices/${deviceId}/feeding/schedule`, 
                schedule,
                config
            );
            
            console.log('API Response:', response.data);

            // Update local storage
            const stored = await AsyncStorage.getItem(`feeding_schedules_${deviceId}`);
            if (stored) {
                const schedules = JSON.parse(stored);
                schedules.data = [...schedules.data, response.data.data];
                await AsyncStorage.setItem(
                    `feeding_schedules_${deviceId}`,
                    JSON.stringify(schedules)
                );
            }

            return response.data;
        } catch (error: any) {
            console.error('Error creating schedule:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                config: error.config
            });
            throw error;
        }
    }

    static async deleteSchedule(deviceId: string, scheduleId: string): Promise<void> {
        try {
            const config = await this.getAuthHeader();
            await api.delete(`/devices/${deviceId}/feeding/schedule/${scheduleId}`, config);
            
            // Update local storage
            const stored = await AsyncStorage.getItem(`feeding_schedules_${deviceId}`);
            if (stored) {
                const schedules = JSON.parse(stored);
                schedules.data = schedules.data.filter((s: FeedingSchedule) => s.id !== scheduleId);
                await AsyncStorage.setItem(
                    `feeding_schedules_${deviceId}`,
                    JSON.stringify(schedules)
                );
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            throw error;
        }
    }

    static async triggerFeeding(deviceId: string): Promise<ApiResponse<void>> {
        const config = await this.getAuthHeader();
        const response = await api.post(`/api/devices/${deviceId}/feeding/trigger`, {}, config);
        
        // Update feeding history in storage
        await this.getFeedingHistory(deviceId, true); // Force refresh
        
        return response.data;
    }

    static async getFeedingHistory(
        deviceId: string, 
        forceRefresh = false
    ): Promise<ApiResponse<FeedingHistory[]>> {
        try {
            // If not forcing refresh, try to get from local storage first
            if (!forceRefresh) {
                const stored = await AsyncStorage.getItem(`feeding_history_${deviceId}`);
                if (stored) {
                    return JSON.parse(stored);
                }
            }

            // Fetch from API
            const config = await this.getAuthHeader();
            const response = await api.get(`/api/devices/${deviceId}/feeding/history`, config);
            
            // Store the response
            await AsyncStorage.setItem(
                `feeding_history_${deviceId}`,
                JSON.stringify(response.data)
            );

            return response.data;
        } catch (error) {
            console.error('Error getting feeding history:', error);
            throw error;
        }
    }

    static async clearDeviceData(deviceId: string) {
        try {
            await Promise.all([
                AsyncStorage.removeItem(`feeding_schedules_${deviceId}`),
                AsyncStorage.removeItem(`feeding_history_${deviceId}`)
            ]);
        } catch (error) {
            console.error('Error clearing feeding data:', error);
        }
    }
}

export default FeedingService; 