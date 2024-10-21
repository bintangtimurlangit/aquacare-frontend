import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../assets/icons/arrow-left.svg'

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                         <ArrowLeft height={30} width={30} style={{color:'rgba(237, 237, 237, 0.7)'}} />
                    </TouchableOpacity>
                    <Image source={require('../assets/images/logo-text.png')} style={styles.image} />
                </View>

                <Text style={styles.title}>Let's get you started</Text>
                <Text style={styles.subtitle}>Create your account here</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.text}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={styles.alertWrapper}>
                        <Text style={styles.text}>Confirm Password</Text>
                        <Text style={styles.textAlert}>Password doesn't match!</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#A8A8A8"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
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
        marginTop: 132,
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
    }
});