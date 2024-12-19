import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { authAPI } from '../../services/api/auth';
import { deviceAPI } from '../../services/api/device';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Attempting login for:', email);
            
            // Login
            const response = await authAPI.login({ email, password });
            await login(response.token, response.user);
            
            // Check if user has devices
            const devices = await deviceAPI.getUserDevices();
            console.log('📱 Found devices:', devices.length);

            // Redirect based on device status
            if (devices.length === 0) {
                console.log('➡️ Redirecting to device registration');
                router.push('/(auth)/register-device');
            } else {
                console.log('➡️ Redirecting to home with first device');
                router.push({
                    pathname: '/(main)/home',
                    params: { deviceId: devices[0].id }
                });
            }
        } catch (error: any) {
            console.error('❌ Login failed:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            Alert.alert(
                'Login Failed', 
                error.response?.data?.error || 'An error occurred during login'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterNavigation = () => {
        router.push('/(auth)/register');
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons 
                            name="arrow-back" 
                            size={24} 
                            color="rgba(237, 237, 237, 0.7)" 
                        />
                    </TouchableOpacity>
                    <Image source={require('../../assets/images/logo.png')} style={styles.image} />
                </View>

                <Text style={styles.title}>Sign in to your Account</Text>
                <Text style={styles.subtitle}>Welcome back! Let's sign to your account.</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={email}
                        onChangeText={setEmail}
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
                        secureTextEntry
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onLogin}>
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