import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LineGraph } from '../../../../components/ui/line-graph';
import MetricsStorageService from '../../../../services/metricsStorage';
import { useDevice } from '../../../../context/DeviceContext';

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

export default function Advanced() {
    const { deviceId } = useLocalSearchParams();
    const { currentDevice } = useDevice();
    const [metrics, setMetrics] = useState<StoredMetrics>({
        ph_level: [],
        temperature: [],
        water_level: [],
        lastUpdate: ''
    });

    useEffect(() => {
        loadMetrics();
    }, [deviceId]);

    const loadMetrics = async () => {
        if (!currentDevice) return;
        
        const storedMetrics = await MetricsStorageService.getLatestMetrics(currentDevice.id);
        if (storedMetrics) {
            setMetrics(storedMetrics);
        }
    };

    // Get latest values for stats
    const getLatestValue = (array: MetricPoint[]) => {
        return array.length > 0 ? array[array.length - 1].value : 0;
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

            <View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b2447',
        width: '100%',
        height: '100%',
    },
    header: {
        marginHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 66,
    },
    headerText: {
        fontWeight: "bold",
        color: 'rgba(237, 237, 237, 0.7)',
        fontSize: 16,
    },
    cardGraph: {
        marginHorizontal: 32,
        marginTop: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    }
});