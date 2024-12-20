import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LineGraph } from '../../../../components/ui/line-graph';
import MetricsStorageService from '../../../../services/metricsStorage';
import { useDevice } from '../../../../context/DeviceContext';
import AlertsStorageService, { Alert } from '../../../../services/alertsStorage';
import SocketService from '../../../../services/socket';

// Import the types from metricsStorage
interface MetricPoint {
    value: number;
    timestamp: string;
}

interface StoredMetrics {
    ph_level: MetricPoint[];
    temperature: MetricPoint[];
    water_level: MetricPoint[];
    lastUpdate: string;
}

// Dummy alerts data
const DUMMY_ALERTS = [
    {
        id: '1',
        type: 'critical',
        message: 'pH level is too low',
        value: 6.2,
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago
    },
    {
        id: '2',
        type: 'warning',
        message: 'Temperature is approaching critical level',
        value: 28,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
    },
    {
        id: '3',
        type: 'critical',
        message: 'Water level is too low',
        value: 45,
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 minutes ago
    }
];

export default function Advanced() {
    const { deviceId } = useLocalSearchParams();
    const { currentDevice } = useDevice();
    const [metrics, setMetrics] = useState<StoredMetrics>({
        ph_level: [],
        temperature: [],
        water_level: [],
        lastUpdate: ''
    });
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        loadMetrics();
        if (!currentDevice) return;

        // Load initial alerts
        loadAlerts();

        // Connect with callbacks for real-time updates
        SocketService.connect({
            onMetricsUpdate: async (newMetrics) => {
                // Update metrics state with new data
                setMetrics(prevMetrics => ({
                    ph_level: [...prevMetrics.ph_level, { 
                        value: newMetrics.ph_level,
                        timestamp: newMetrics.timestamp 
                    }],
                    temperature: [...prevMetrics.temperature, { 
                        value: newMetrics.temperature,
                        timestamp: newMetrics.timestamp 
                    }],
                    water_level: [...prevMetrics.water_level, { 
                        value: newMetrics.water_level,
                        timestamp: newMetrics.timestamp 
                    }],
                    lastUpdate: newMetrics.timestamp
                }));

                // Store updated metrics
                await MetricsStorageService.updateMetrics(currentDevice.id, {
                    temperature: newMetrics.temperature,
                    ph_level: newMetrics.ph_level,
                    water_level: newMetrics.water_level,
                    timestamp: newMetrics.timestamp
                });
            },
            onAlertsUpdate: (newAlerts) => {
                setAlerts(newAlerts);
            }
        });

        // Subscribe to device updates
        SocketService.subscribeToDevice(currentDevice.id);

        return () => {
            SocketService.unsubscribeFromDevice(currentDevice.id);
            SocketService.disconnect();
        };
    }, [deviceId, currentDevice]);

    const loadMetrics = async () => {
        if (!currentDevice) return;
        
        const storedMetrics = await MetricsStorageService.getLatestMetrics(currentDevice.id);
        if (storedMetrics) {
            setMetrics(storedMetrics);
        }
    };

    const loadAlerts = async () => {
        if (!currentDevice) return;
        
        const storedAlerts = await AlertsStorageService.getLatestAlerts(currentDevice.id);
        setAlerts(storedAlerts);
    };

    // Get latest values for stats
    const getLatestValue = (array: MetricPoint[]) => {
        return array.length > 0 ? array[array.length - 1].value : 0;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Advanced View</Text>
                <TouchableOpacity onPress={() => router.push("/(main)/settings")}>
                    <Ionicons name="settings-outline" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.graphsContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Metrics History</Text>
                        <TouchableOpacity 
                            style={styles.scheduleButton}
                            onPress={() => router.push(`/(main)/home/${currentDevice?.id}/schedule`)}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#A5D7E8" />
                            <Text style={styles.scheduleButtonText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>

                    <LineGraph
                        data={metrics.ph_level.map(point => point.value)}
                        style={styles.cardGraph}
                        color={{
                            dark: "#A5D7E8",
                            light: "#3e565e",
                            nearWhite: "#A5D7E8"
                        }}
                        label="PH LEVEL"
                        stat={getLatestValue(metrics.ph_level).toFixed(1)}
                    />

                    <LineGraph
                        data={metrics.temperature.map(point => point.value)}
                        style={styles.cardGraph}
                        color={{
                            dark: "#A5D7E8",
                            light: "#3e565e",
                            nearWhite: "#A5D7E8"
                        }}
                        label="TEMPERATURE"
                        stat={`${getLatestValue(metrics.temperature).toFixed(1)} °C`}
                    />

                    <LineGraph
                        data={metrics.water_level.map(point => point.value)}
                        style={styles.cardGraph}
                        color={{
                            dark: "#A5D7E8",
                            light: "#3e565e",
                            nearWhite: "#A5D7E8"
                        }}
                        label="WATER LEVEL"
                        stat={`${getLatestValue(metrics.water_level).toFixed(0)}%`}
                    />
                </View>

                <View style={styles.alertsSection}>
                    <Text style={styles.sectionTitle}>Recent Alerts</Text>
                    <View style={styles.alertsList}>
                        {DUMMY_ALERTS.map((alert) => (
                            <View 
                                key={alert.id} 
                                style={[
                                    styles.alertItem,
                                    alert.type === 'critical' ? styles.criticalAlert : styles.warningAlert
                                ]}
                            >
                                <View style={styles.alertContent}>
                                    <Text style={styles.alertMessage}>{alert.message}</Text>
                                    <Text style={styles.alertValue}>Value: {alert.value}</Text>
                                </View>
                                <Text style={styles.alertTime}>
                                    {formatTimestamp(alert.timestamp)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
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
        marginBottom: 32,
    },
    headerText: {
        fontWeight: "bold",
        color: 'rgba(237, 237, 237, 0.7)',
        fontSize: 16,
    },
    content: {
        flex: 1,
    },
    graphsContainer: {
        paddingHorizontal: 32,
        marginBottom: 40,
    },
    cardGraph: {
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    alertsSection: {
        paddingHorizontal: 32,
        marginBottom: 32,
    },
    alertsList: {
        gap: 12,
        marginTop: 16,
    },
    alertItem: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    criticalAlert: {
        backgroundColor: 'rgba(255, 69, 58, 0.15)',
        borderLeftWidth: 4,
        borderLeftColor: '#FF454A',
    },
    warningAlert: {
        backgroundColor: 'rgba(255, 159, 10, 0.15)',
        borderLeftWidth: 4,
        borderLeftColor: '#FF9F0A',
    },
    alertContent: {
        flex: 1,
    },
    alertMessage: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    alertValue: {
        color: 'rgba(237, 237, 237, 0.7)',
        fontSize: 12,
        marginTop: 4,
    },
    alertTime: {
        color: 'rgba(237, 237, 237, 0.5)',
        fontSize: 12,
        marginLeft: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sectionTitle: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(165, 215, 232, 0.3)',
    },
    scheduleButtonText: {
        color: '#A5D7E8',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
});