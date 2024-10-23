import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import Icon from 'react-native-vector-icons/FontAwesome';
import React from "react";
import {LineGraph} from "./LineGraph";

export default function Advanced() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <ArrowLeft height={30} width={30} style={{color: 'rgba(237, 237, 237, 0.7)'}} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Icon name="cog" size={30} color="rgba(237, 237, 237, 0.7)" />
                </TouchableOpacity>
            </View>

            <LineGraph
                data={[7.6, 7.8, 9.1, 6.6, 7.6, 7.5, 7.2, 6.5]}
                style={{ marginHorizontal: 32, marginTop: 20, borderRadius: 25 }}
                color={{
                    dark: "#A5D7E8",
                    light: "#3e565e",
                    nearWhite: "#A5D7E8"
                }}
                label="PH LEVEL"
                stat="8.0"
            />

            <View style={styles.card}>

            </View>

            <View style={styles.card}>

            </View>

            <View style={styles.card}>

            </View>



        </View>
    )
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
    logo: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
    },
    card: {
        borderRadius: 25,
        backgroundColor: '#0B192C',
        height: 140,
        marginHorizontal: 32,
        marginTop: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});