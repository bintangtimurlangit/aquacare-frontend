import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface Device {
    id: string;
    name: string;
    lastActive?: string;
}

interface DeviceContextType {
    currentDevice: Device | null;
    selectDevice: (device: Device) => void;
    clearDevice: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
    const [currentDevice, setCurrentDevice] = useState<Device | null>(null);

    useEffect(() => {
        loadSavedDevice();
    }, []);

    const loadSavedDevice = async () => {
        try {
            const savedDevice = await AsyncStorage.getItem('currentDevice');
            if (savedDevice) {
                setCurrentDevice(JSON.parse(savedDevice));
            }
        } catch (error) {
            console.error('Error loading saved device:', error);
        }
    };

    const selectDevice = async (device: Device) => {
        try {
            await AsyncStorage.setItem('currentDevice', JSON.stringify(device));
            setCurrentDevice(device);
        } catch (error) {
            console.error('Error saving device:', error);
        }
    };

    const clearDevice = async () => {
        try {
            await AsyncStorage.removeItem('currentDevice');
            setCurrentDevice(null);
        } catch (error) {
            console.error('Error clearing device:', error);
        }
    };

    return (
        <DeviceContext.Provider value={{ currentDevice, selectDevice, clearDevice }}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
} 