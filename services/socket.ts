import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';
import AlertsStorageService, { Alert } from './alertsStorage';

interface MetricsData {
    deviceId: string;
    metrics: {
        id: string;
        deviceId: string;
        ph_level: number;
        water_level: number;
        temperature: number;
        timestamp: string;
    };
    timestamp: string;
}

type SocketCallback = {
    onMetricsUpdate?: (metrics: MetricsData['metrics']) => void;
    onConnectionChange?: (status: boolean) => void;
    onLastUpdate?: (timestamp: string) => void;
    onAlertsUpdate?: (alerts: Alert[]) => void;
};

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private currentDeviceId: string | null = null;
    private callbacks: SocketCallback = {};

    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect(callbacks: SocketCallback = {}) {
        if (!this.socket) {
            this.socket = io(API_CONFIG.baseURL);
            this.setupSocketListeners();
        }
        this.callbacks = callbacks;
        return this.socket;
    }

    private setupSocketListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected with ID:', this.socket?.id);
            if (this.currentDeviceId) {
                this.subscribeToDevice(this.currentDeviceId);
            }
            this.callbacks.onConnectionChange?.(true);
        });

        this.socket.on('metrics_update', (data: MetricsData) => {
            // console.log('Received metrics update:', data);
            if (this.callbacks.onMetricsUpdate) {
                this.callbacks.onMetricsUpdate(data.metrics);
            }
            if (this.callbacks.onLastUpdate) {
                this.callbacks.onLastUpdate(data.metrics.timestamp);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.callbacks.onConnectionChange?.(false);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.callbacks.onConnectionChange?.(false);
        });

        this.socket.on('alerts', async (data: { 
            alerts: Omit<Alert, 'id'>[],
            timestamp: string 
        }) => {
            if (this.currentDeviceId) {
                // Store alerts
                const updatedAlerts = await AlertsStorageService.addAlerts(
                    this.currentDeviceId,
                    data.alerts.map(alert => ({
                        ...alert,
                        timestamp: data.timestamp
                    }))
                );

                // Notify through callback
                this.callbacks.onAlertsUpdate?.(updatedAlerts);
            }
        });
    }

    subscribeToDevice(deviceId: string) {
        if (this.socket && deviceId) {
            console.log('Subscribing to device:', deviceId);
            this.currentDeviceId = deviceId;
            this.socket.emit('subscribe_device', deviceId);
        }
    }

    unsubscribeFromDevice(deviceId: string) {
        if (this.socket && deviceId) {
            console.log('Unsubscribing from device:', deviceId);
            this.socket.emit('unsubscribe_device', deviceId);
            this.currentDeviceId = null;
        }
    }

    disconnect() {
        if (this.currentDeviceId) {
            this.unsubscribeFromDevice(this.currentDeviceId);
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.callbacks = {};
    }

    getSocket() {
        return this.socket;
    }
}

export default SocketService.getInstance(); 