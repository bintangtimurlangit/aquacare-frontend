import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebSocketContext } from '../websocket/WebSocketContext';
import { LineGraph } from "./LineGraph";

export default function Advanced() {
    const navigation = useNavigation();
    const { temperatureData, phData, waterData, temperature, ph, water } = useContext(WebSocketContext);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <ArrowLeft height={30} width={30} style={{ color: 'rgba(237, 237, 237, 0.7)' }} />
                </TouchableOpacity>

                <Text style={styles.headerText}>Advanced View</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Icon name="cog" size={30} color='rgba(237, 237, 237, 0.7)' />
                </TouchableOpacity>
            </View>

            <View>
                <LineGraph
                    data={phData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="PH LEVEL"
                    stat={ph.toFixed(1)}
                />

                <LineGraph
                    data={temperatureData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="TEMPERATURE"
                    stat={`${temperature.toFixed(1)} °C`}
                />

                <LineGraph
                    data={waterData}
                    style={styles.cardGraph}
                    color={{
                        dark: "#A5D7E8",
                        light: "#3e565e",
                        nearWhite: "#A5D7E8"
                    }}
                    label="WATER LEVEL"
                    stat={`${water}%`}
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
    },
    logo: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
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