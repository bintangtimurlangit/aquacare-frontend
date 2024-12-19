import { api } from './index';
import { ApiResponse } from '../../types/api';

interface Device {
  id: string;
  name: string;
  userId: string;
}

interface DevicesResponse {
  devices: Device[];
}

export const deviceAPI = {
  getUserDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get<ApiResponse<DevicesResponse>>('/api/devices/my-devices');
      console.log('📱 User devices:', response.data);
      return response.data.data?.devices || [];
    } catch (error: any) {
      console.error('❌ Failed to fetch devices:', error.response?.data);
      throw error;
    }
  },

  registerDevice: async (deviceId: string, name?: string): Promise<Device> => {
    try {
      console.log('🔄 Registering device:', { deviceId, name });
      const response = await api.post<ApiResponse<{ device: Device }>>('/api/devices/register', {
        deviceId,
        name
      });
      console.log('✅ Device registered:', response.data);
      return response.data.data!.device;
    } catch (error: any) {
      console.error('❌ Device registration failed:', error.response?.data);
      throw error;
    }
  }
};
