import AsyncStorage from '@react-native-async-storage/async-storage';

interface MetricPoint {
    value: number;
    timestamp: string;
}

interface DeviceMetrics {
    ph_level: MetricPoint[];
    temperature: MetricPoint[];
    water_level: MetricPoint[];
    lastUpdate: string;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_POINTS = 60; // Maximum number of data points to store (1 per minute for 1 hour)

class MetricsStorageService {
    private static async getDeviceMetrics(deviceId: string): Promise<DeviceMetrics> {
        try {
            const stored = await AsyncStorage.getItem(`metrics_${deviceId}`);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading metrics:', error);
        }
        
        return {
            ph_level: [],
            temperature: [],
            water_level: [],
            lastUpdate: new Date().toISOString()
        };
    }

    static async updateMetrics(deviceId: string, newMetrics: {
        ph_level: number;
        temperature: number;
        water_level: number;
        timestamp: string;
    }) {
        try {
            const currentMetrics = await this.getDeviceMetrics(deviceId);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - ONE_HOUR);

            // Function to update a specific metric array
            const updateMetricArray = (
                array: MetricPoint[], 
                newValue: number
            ): MetricPoint[] => {
                // Filter out points older than 1 hour
                const filtered = array.filter(point => 
                    new Date(point.timestamp) > oneHourAgo
                );
                
                // Add new point
                filtered.push({
                    value: newValue,
                    timestamp: newMetrics.timestamp
                });

                // Keep only the latest MAX_POINTS points
                return filtered.slice(-MAX_POINTS);
            };

            // Update each metric
            const updatedMetrics: DeviceMetrics = {
                ph_level: updateMetricArray(currentMetrics.ph_level, newMetrics.ph_level),
                temperature: updateMetricArray(currentMetrics.temperature, newMetrics.temperature),
                water_level: updateMetricArray(currentMetrics.water_level, newMetrics.water_level),
                lastUpdate: newMetrics.timestamp
            };

            // Save updated metrics
            await AsyncStorage.setItem(
                `metrics_${deviceId}`,
                JSON.stringify(updatedMetrics)
            );

            return updatedMetrics;
        } catch (error) {
            console.error('Error updating metrics:', error);
            throw error;
        }
    }

    static async getLatestMetrics(deviceId: string): Promise<DeviceMetrics | null> {
        try {
            const metrics = await this.getDeviceMetrics(deviceId);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - ONE_HOUR);

            // Filter out old data points
            const filtered: DeviceMetrics = {
                ph_level: metrics.ph_level.filter(point => 
                    new Date(point.timestamp) > oneHourAgo
                ),
                temperature: metrics.temperature.filter(point => 
                    new Date(point.timestamp) > oneHourAgo
                ),
                water_level: metrics.water_level.filter(point => 
                    new Date(point.timestamp) > oneHourAgo
                ),
                lastUpdate: metrics.lastUpdate
            };

            return filtered;
        } catch (error) {
            console.error('Error getting metrics:', error);
            return null;
        }
    }

    static async clearDeviceMetrics(deviceId: string) {
        try {
            await AsyncStorage.removeItem(`metrics_${deviceId}`);
        } catch (error) {
            console.error('Error clearing metrics:', error);
        }
    }
}

export default MetricsStorageService; 