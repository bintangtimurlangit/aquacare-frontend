import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../assets/icons/arrow-left.svg'
import { authAPI, deviceAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { WebSocketContext } from '../websocket/WebSocketContext';

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setDeviceToken } = useContext(WebSocketContext);

    const handleRegisterNavigation = () => {
        navigation.navigate('Register');
    };

    const handleLogin = async () => {
        try {
            const { token } = await authAPI.login(username, password);
            await AsyncStorage.setItem('userToken', token);

            const { devices } = await deviceAPI.getUserDevices();

            if (devices && devices.length > 0) {
                const { aquarium_name, token: deviceToken } = devices[0];
                setDeviceToken(deviceToken);
                navigation.navigate('Home', { aquariumName: aquarium_name, deviceToken: deviceToken });
            } else {
                navigation.navigate('DeviceScan');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                Alert.alert('Unauthorized', 'Your session has expired. Please log in again.');
            } else {
                Alert.alert('Login Failed', error.response?.data?.message || 'Invalid username or password.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                        <ArrowLeft height={30} width={30} style={{color:'rgba(237, 237, 237, 0.7)'}} />
                    </TouchableOpacity>
                    <Image source={require('../assets/images/logo-text.png')} style={styles.image} />
                </View>

                <Text style={styles.title}>Sign in to your Account</Text>
                <Text style={styles.subtitle}>Welcome back! Let's sign to your account.</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <View style={styles.alertWrapper}>
                        <Text style={styles.text}>Password</Text>
                        <Text style={styles.textAlert}>Invalid Password!</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.footerContent}>
                            <Text style={styles.footerText}>
                                Don't have an account?{'  '}
                            </Text>
                            <TouchableOpacity onPress={handleRegisterNavigation}>
                                <Text style={styles.registerText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    subtitle: {
        fontSize: 18,
        marginTop: 16,
        color: 'rgba(237, 237, 237, 0.7)'
    },
    wrapper: {
        marginHorizontal: 32
    },
    image: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
    },
    input: {
        color: '#FFFFFF',
        marginTop: 8,
        height: 50,
        borderColor: '#19376D',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#19376D',
    },
    inputWrapper: {
        marginTop: 26,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 208,
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
    text: {
        marginTop: 8,
        color: '#FFFFFF',
    },
    textAlert: {
        color: '#A5D7E8',
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    alertWrapper: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    footer: {
        marginHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    registerText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
    },
});