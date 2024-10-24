import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import React, { useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebSocketContext } from '../websocket/WebSocketContext';

export default function Settings() {
    const navigation = useNavigation();
    const { setDeviceToken } = useContext(WebSocketContext);

    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: async () => {
                        await AsyncStorage.removeItem('userToken');

                        setDeviceToken(null);

                        navigation.navigate('Onboarding');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Advanced')}>
                        <ArrowLeft height={30} width={30} style={{color:'rgba(237, 237, 237, 0.7)'}} />
                    </TouchableOpacity>
                    <Image source={require('../assets/images/logo-text.png')} style={styles.image} />
                </View>

                <Text style={styles.title}>Settings</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Sign Out Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b2447',
    },
    wrapper: {
        marginHorizontal: 32
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 66,
    },
    title: {
        fontSize: 42,
        textAlign: 'left',
        paddingTop: 20,
        color: '#FFFFFF'
    },
    image: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
    },
    buttonContainer: {
        width: '100%',
        marginTop: 560,
    },
    button: {
        backgroundColor: '#A5D7E8',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#0B2447'
    },
});