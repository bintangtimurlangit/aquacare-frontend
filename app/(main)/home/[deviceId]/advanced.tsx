import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LineGraph } from '../../../../components/ui/line-graph';

export default function Advanced() {
    // Dummy data for the graphs
    const dummyPhData = [7.0, 7.2, 7.1, 7.3, 7.2, 7.0, 7.1, 7.2, 7.3, 7.1];
    const dummyTempData = [26, 27, 26.5, 27.5, 27, 26.8, 27.2, 27.5, 27.3, 27.5];
    const dummyWaterData = [85, 84, 83, 85, 86, 85, 84, 83, 85, 85];

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
                    data={dummyPhData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="PH LEVEL"
                    stat="7.2"
                />

                <LineGraph
                    data={dummyTempData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="TEMPERATURE"
                    stat="27.5 °C"
                />

                <LineGraph
                    data={dummyWaterData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="WATER LEVEL"
                    stat="85%"
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