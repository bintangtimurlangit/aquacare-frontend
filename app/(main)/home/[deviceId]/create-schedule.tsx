import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import FeedingService from '../../../../services/feeding';

const DAYS = [
    { id: '1', name: 'Monday' },
    { id: '2', name: 'Tuesday' },
    { id: '3', name: 'Wednesday' },
    { id: '4', name: 'Thursday' },
    { id: '5', name: 'Friday' },
    { id: '6', name: 'Saturday' },
    { id: '7', name: 'Sunday' },
];

export default function CreateSchedule() {
    const { deviceId } = useLocalSearchParams();
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [existingSchedules, setExistingSchedules] = useState<{[key: string]: boolean}>({});

    React.useEffect(() => {
        loadExistingSchedules();
    }, []);

    const loadExistingSchedules = async () => {
        if (!deviceId) return;
        const response = await FeedingService.getSchedules(deviceId as string);
        if (response.data) {
            const dayMap: {[key: string]: boolean} = {};
            response.data.forEach(schedule => {
                schedule.days.split(',').forEach(day => {
                    dayMap[day] = true;
                });
            });
            setExistingSchedules(dayMap);
        }
    };

    const toggleDay = (dayId: string) => {
        if (existingSchedules[dayId]) {
            // Day already has a schedule
            alert('This day already has a schedule. It will be updated if you proceed.');
        }
        setSelectedDays(prev => 
            prev.includes(dayId) 
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId]
        );
    };

    const handleSave = async () => {
        if (selectedDays.length === 0) {
            alert('Please select at least one day');
            return;
        }

        try {
            const timeString = selectedTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            await FeedingService.createSchedule(deviceId as string, {
                time: timeString,
                days: selectedDays.sort().join(','),
                isActive: true
            });

            router.back();
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('Failed to create schedule');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Create Schedule</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Time</Text>
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, date) => date && setSelectedTime(date)}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Days</Text>
                    <View style={styles.daysGrid}>
                        {DAYS.map(day => (
                            <TouchableOpacity
                                key={day.id}
                                style={[
                                    styles.dayButton,
                                    selectedDays.includes(day.id) && styles.dayButtonSelected,
                                    existingSchedules[day.id] && styles.dayButtonExisting
                                ]}
                                onPress={() => toggleDay(day.id)}
                            >
                                <Text style={[
                                    styles.dayButtonText,
                                    selectedDays.includes(day.id) && styles.dayButtonTextSelected
                                ]}>
                                    {day.name}
                                </Text>
                            </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 66,
        marginBottom: 32,
    },
    headerText: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        color: '#A5D7E8',
        fontSize: 16,
        fontWeight: '500',
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
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: '30%',
        alignItems: 'center',
    },
    dayButtonSelected: {
        backgroundColor: '#A5D7E8',
    },
    dayButtonExisting: {
        borderColor: '#FF9800',
        borderWidth: 1,
    },
    dayButtonText: {
        color: 'rgba(237, 237, 237, 0.9)',
        fontSize: 14,
    },
    dayButtonTextSelected: {
        color: '#0B2447',
        fontWeight: '500',
    },
}); 