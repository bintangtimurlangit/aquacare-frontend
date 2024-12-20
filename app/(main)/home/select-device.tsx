import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDevice, Device } from '../../../context/DeviceContext';
import { deviceAPI } from '../../../services/api/device';

export default function SelectDevice() {
    const { selectDevice, currentDevice } = useDevice();
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            setIsLoading(true);
            const userDevices = await deviceAPI.getUserDevices();
            setDevices(userDevices);
        } catch (error) {
            console.error('Failed to load devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeviceSelect = async (device: Device) => {
        await selectDevice(device);
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
                <Image 
                    source={require('../../../assets/images/logo.png')} 
                    style={styles.logo}
                />
            </View>

            <View style={styles.wrapper}>
                <Text style={styles.title}>Select Device</Text>
                <Text style={styles.subtitle}>
                    Choose an aquarium to monitor
                </Text>
            </View>

            <View style={styles.deviceList}>
                {devices.map((device) => (
                    <TouchableOpacity
                        key={device.id}
                        style={[
                            styles.deviceItem,
                            currentDevice?.id === device.id && styles.selectedDevice
                        ]}
                        onPress={() => handleDeviceSelect(device)}
                    >
                        <View style={styles.deviceIcon}>
                            <MaterialCommunityIcons 
                                name="fish" 
                                size={24} 
                                color={currentDevice?.id === device.id ? "#0B2447" : "#A5D7E8"} 
                            />
                        </View>
                        <View style={styles.deviceInfo}>
                            <Text style={styles.deviceName}>{device.name}</Text>
                            <Text style={styles.deviceStatus}>
                                {currentDevice?.id === device.id ? "Selected" : device.lastActive}
                            </Text>
                        </View>
                        {currentDevice?.id === device.id && (
                            <MaterialCommunityIcons name="check-circle" size={24} color="#A5D7E8" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.push('/(auth)/register-device')}
                >
                    <Text style={styles.buttonText}>Add New Device</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b2447',
    },
    header: {
        marginHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 66,
    },
    backButton: {
        fontSize: 30,
        color: 'rgba(237, 237, 237, 0.7)',
    },
    logo: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
    },
    wrapper: {
        marginHorizontal: 32,
    },
    title: {
        fontSize: 42,
        textAlign: 'left',
        paddingTop: 20,
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 16,
        color: 'rgba(237, 237, 237, 0.7)',
        marginBottom: 32,
    },
    deviceList: {
        marginHorizontal: 32,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(25, 55, 109, 0.5)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    deviceIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    deviceStatus: {
        color: 'rgba(237, 237, 237, 0.6)',
        fontSize: 14,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 32,
        left: 32,
        right: 32,
    },
    button: {
        backgroundColor: '#A5D7E8',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#0B2447',
        fontWeight: 'bold',
        fontSize: 16,
    },
    selectedDevice: {
        backgroundColor: 'rgba(165, 215, 232, 0.2)',
        borderColor: '#A5D7E8',
        borderWidth: 1,
    },
});
