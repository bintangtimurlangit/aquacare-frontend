import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from "../assets/icons/arrow-left.svg";
import {BarCodeScanner} from "expo-barcode-scanner";

export default function DeviceScan() {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [manualCode, setManualCode] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        Alert.alert('QR Code Scanned', `Data: ${data}`);
        // Optionally: you can add navigation or further actions here
    };

    const handleSubmit = () => {
        Alert.alert('Manual Code Submitted', `Code: ${manualCode}`);
        // Further actions can be added here
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (showInput) {
                        setShowInput(false);
                    } else {
                        navigation.navigate('Home');
                    }
                }}>
                    <ArrowLeft height={30} width={30} style={{color: 'rgba(237, 237, 237, 0.7)'}} />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo-text.png')} style={styles.logo} />
            </View>

            <View style={{marginHorizontal: 32}}>
                <Text style={styles.title}>Add New Device</Text>

                <Text style={styles.subtitle}>
                    {showInput ? 'Input the code that is located in the back of the device.' : 'Scan the QR code that is located in the back of the device.'}
                </Text>

                {showInput && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter code"
                        placeholderTextColor="#FFFFFF"
                        value={manualCode}
                        onChangeText={setManualCode}
                    />
                )}
            </View>

            <View style={styles.cameraContainer}>
                {!showInput && (
                    <BarCodeScanner
                        onBarCodeScanned={handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                )}
            </View>

            <View style={styles.buttonContainer}>
                {showInput && (
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowInput(!showInput)}
                >
                    <Text style={styles.buttonText}>
                        {showInput ? 'Back to Camera' : 'Enter code manually'}
                    </Text>
                </TouchableOpacity>
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
    logo: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
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
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 32,
        marginBottom: 30,
        overflow: 'hidden',
        borderRadius: 15,
    },
    buttonContainer: {
        marginHorizontal: 32,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#A5D7E8',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#A5D7E8',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#0B2447'
    },
    input: {
        color: '#FFFFFF',
        marginTop: 16,
        height: 50,
        borderColor: '#19376D',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#19376D',
        width: '100%',
        textAlign: 'center',
    },
});