import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Alert {
    id: string;
    type: 'critical' | 'warning';
    message: string;
    value: number;
    timestamp: string;
    deviceId: string;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_ALERTS = 50; // Maximum number of alerts to store

class AlertsStorageService {
    private static async getDeviceAlerts(deviceId: string): Promise<Alert[]> {
        try {
            const stored = await AsyncStorage.getItem(`alerts_${deviceId}`);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading alerts:', error);
        }
        return [];
    }

    static async addAlerts(deviceId: string, newAlerts: Omit<Alert, 'id'>[]) {
        try {
            const currentAlerts = await this.getDeviceAlerts(deviceId);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - ONE_HOUR);

            // Filter out old alerts
            const recentAlerts = currentAlerts.filter(alert => 
                new Date(alert.timestamp) > oneHourAgo
            );

            // Add new alerts with generated IDs
            const updatedAlerts = [
                ...recentAlerts,
                ...newAlerts.map(alert => ({
                    ...alert,
                    id: Math.random().toString(36).substr(2, 9),
                    deviceId
                }))
            ]
            // Keep only the latest MAX_ALERTS
            .slice(-MAX_ALERTS);

            // Save updated alerts
            await AsyncStorage.setItem(
                `alerts_${deviceId}`,
                JSON.stringify(updatedAlerts)
            );

            return updatedAlerts;
        } catch (error) {
            console.error('Error updating alerts:', error);
            throw error;
        }
    }

    static async getLatestAlerts(deviceId: string): Promise<Alert[]> {
        try {
            const alerts = await this.getDeviceAlerts(deviceId);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - ONE_HOUR);

            // Filter out old alerts
            return alerts.filter(alert => 
                new Date(alert.timestamp) > oneHourAgo
            );
        } catch (error) {
            console.error('Error getting alerts:', error);
            return [];
        }
    }

    static async clearDeviceAlerts(deviceId: string) {
        try {
            await AsyncStorage.removeItem(`alerts_${deviceId}`);
        } catch (error) {
            console.error('Error clearing alerts:', error);
        }
    }
}

export default AlertsStorageService; 