import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        // Check passwords match whenever either password field changes
        setPasswordsMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    const onRegister = async () => {
        if (!passwordsMatch) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            console.log('📤 Sending registration data:', { email, name });
            const response = await authAPI.register({ email, password, name });
            console.log('📥 Registration response:', response);
            await login(response.token, response.user);
            router.push('/(auth)/register-device');
        } catch (error: any) {
            console.error('❌ Registration error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            Alert.alert(
                'Registration Failed', 
                error.response?.data?.error || 'An error occurred during registration'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                    <Text style={styles.title}>Let's get you started</Text>
                    <Text style={styles.subtitle}>Create your account here</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.text}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#A8A8A8"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.text}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#A8A8A8"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.text}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#A8A8A8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <View style={styles.alertWrapper}>
                            <Text style={styles.text}>Confirm Password</Text>
                            {!passwordsMatch && confirmPassword.length > 0 && (
                                <Text style={styles.textAlert}>Password doesn't match!</Text>
                            )}
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#A8A8A8"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={onRegister}
                    disabled={isLoading || !passwordsMatch}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>
                        Already have an account?{'  '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        marginTop: 32,
    },
    button: {
        backgroundColor: '#A5D7E8',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
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
        position: 'absolute',
        bottom: 60,
        left: 32,
        right: 32,
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
    loginText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
    },
});