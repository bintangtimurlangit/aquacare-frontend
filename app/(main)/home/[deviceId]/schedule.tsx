import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDevice } from '../../../../context/DeviceContext';
import FeedingService, { FeedingSchedule, FeedingHistory } from '../../../../services/feeding';

export default function Schedule() {
    const { deviceId } = useLocalSearchParams();
    const { currentDevice } = useDevice();
    const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
    const [history, setHistory] = useState<FeedingHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentDevice) return;
        loadScheduleData();
    }, [currentDevice]);

    const loadScheduleData = async () => {
        try {
            setIsLoading(true);
            const [scheduleData, historyData] = await Promise.all([
                FeedingService.getSchedules(currentDevice!.id),
                FeedingService.getFeedingHistory(currentDevice!.id)
            ]);
            
            if (scheduleData.data) {
                setSchedules(scheduleData.data);
            }
            if (historyData.data) {
                setHistory(historyData.data);
            }
        } catch (error) {
            console.error('Error loading schedule data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTriggerFeeding = async () => {
        try {
            await FeedingService.triggerFeeding(currentDevice!.id);
            // Reload history after triggering feeding
            const newHistory = await FeedingService.getFeedingHistory(currentDevice!.id);
            if (newHistory.data) {
                setHistory(newHistory.data);
            }
        } catch (error) {
            console.error('Error triggering feeding:', error);
        }
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatTimestamp = (feedTime: string) => {
        return new Date(feedTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A5D7E8" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Feeding Schedule</Text>
                <TouchableOpacity onPress={() => router.push("/(main)/home/[deviceId]/create-schedule")}>
                    <Ionicons name="add" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Scheduled Feedings</Text>
                    {schedules.map((schedule) => (
                        <View key={schedule.id} style={styles.scheduleItem}>
                            <View style={styles.scheduleInfo}>
                                <Text style={styles.scheduleTime}>{formatTime(schedule.time)}</Text>
                                <Text style={styles.scheduleDays}>
                                    {schedule.days.split(',').join(', ')}
                                </Text>
                            </View>
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: schedule.isActive ? '#4CAF50' : '#FF9800' }
                            ]} />
                        </View>
                    ))}
                </View>

                <TouchableOpacity 
                    style={styles.feedButton}
                    onPress={handleTriggerFeeding}
                >
                    <Ionicons name="fish" size={24} color="#0B2447" />
                    <Text style={styles.feedButtonText}>Feed Now</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Feedings</Text>
                    {history.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyTimestamp}>
                                    {formatTimestamp(item.feedTime)}
                                </Text>
                            </View>
                            <Text style={styles.historyType}>
                                {item.type === 'scheduled' ? 'Scheduled' : 'Manual'}
                            </Text>
                            <Text style={styles.historySuccess}>
                                {item.success ? '✓ Success' : '✗ Failed'}
                            </Text>
                        </View>
                    ))}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingHorizontal: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scheduleItem: {
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scheduleInfo: {
        flex: 1,
    },
    scheduleTime: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 16,
        fontWeight: '500',
    },
    scheduleDays: {
        color: 'rgba(237, 237, 237, 0.7)',
        fontSize: 14,
        marginTop: 4,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 12,
    },
    feedButton: {
        backgroundColor: '#A5D7E8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 32,
    },
    feedButtonText: {
        color: '#0B2447',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    historyItem: {
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    historyInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    historyTimestamp: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 14,
    },
    historyType: {
        color: 'rgba(237, 237, 237, 0.5)',
        fontSize: 12,
    },
    historySuccess: {
        color: 'rgba(237, 237, 237, 0.5)',
        fontSize: 12,
    },
});
