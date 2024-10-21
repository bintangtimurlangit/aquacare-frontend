import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from "../assets/icons/arrow-left.svg";
import {BarCodeScanner} from "expo-barcode-scanner";

export default function AddDevice() {
    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(null);

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

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <ArrowLeft height={30} width={30} style={{color:'rgba(237, 237, 237, 0.7)'}} />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo-text.png')} style={styles.logo} />
            </View>

            <View style={{marginHorizontal: 32}}>
                <Text style={styles.title}>Add New Device</Text>
                <Text style={styles.subtitle}>Scan the QR code that is located in the back of the device.</Text>
            </View>

            <View style={styles.cameraContainer}>
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enter code manually</Text>
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
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#0B2447'
    },
});