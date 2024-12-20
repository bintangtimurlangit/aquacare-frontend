import api from './index';
import { Device } from '../../context/DeviceContext';
import { ApiResponse } from '../../types/api';

interface DevicesResponse {
  devices: Device[];
}

export const deviceAPI = {
  getUserDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get<DevicesResponse>('/api/devices/my-devices');
      console.log('📱 User devices:', response.data);
      return response.data.devices || [];
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
  },

  getDeviceSettings: async (deviceId: string) => {
    const response = await api.get(`/api/devices/${deviceId}/settings`);
    return response.data.settings;
  },

  updateDeviceSettings: async (deviceId: string, settings: any) => {
    const response = await api.put(`/api/devices/${deviceId}/settings`, settings);
    return response.data.device;
  },

  getDeviceMetrics: async (deviceId: string, startDate?: string, endDate?: string) => {
    const response = await api.get(`/api/devices/${deviceId}/metrics`, {
      params: { startDate, endDate }
    });
    return response.data.metrics;
  },

  getDeviceAlerts: async (deviceId: string) => {
    const response = await api.get(`/api/devices/${deviceId}/alerts`);
    return response.data.alerts;
  }
};
