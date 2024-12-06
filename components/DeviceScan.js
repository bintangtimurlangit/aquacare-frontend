import React, { useEffect, useState, useRef } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from "../assets/icons/arrow-left.svg";
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function DeviceScan() {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedCode, setScannedCode] = useState('');
    const [isScanning, setIsScanning] = useState(true);
    const processingRef = useRef(false);

    useEffect(() => {
        requestPermission();
    }, []);

    const handleBarCodeScanned = (result) => {
        if (!isScanning || scannedCode === result.data || processingRef.current) return;
        
        processingRef.current = true;
        setIsScanning(false);
        setScannedCode(result.data);
        
        Alert.alert('QR Code Scanned', `Device ID: ${result.data}`, [
            {
                text: 'Scan Again',
                onPress: () => {
                    setScannedCode('');
                    setIsScanning(true);
                    processingRef.current = false;
                },
            },
            {
                text: 'Continue',
                onPress: () => {
                    navigation.navigate('Home', { deviceId: result.data });
                    processingRef.current = false;
                },
            },
        ]);
    };

    if (!permission) {
        return <View style={styles.container}>
            <Text style={styles.message}>Requesting camera permission...</Text>
        </View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Camera permission is required to scan QR codes</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <ArrowLeft height={30} width={30} style={{color: 'rgba(237, 237, 237, 0.7)'}} />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo-text.png')} style={styles.logo} />
            </View>

            <View style={{marginHorizontal: 32}}>
                <Text style={styles.title}>Add New Device</Text>
                <Text style={styles.subtitle}>
                    Scan the QR code that is located in the back of the device.
                </Text>
            </View>

            <View style={styles.cameraContainer}>
                <CameraView 
                    style={styles.camera} 
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanArea}>
                            <View style={styles.targetBox}>
                                <Text style={styles.scanText}>Position QR code here</Text>
                            </View>
                        </View>
                    </View>
                </CameraView>
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
        marginHorizontal: 30,
        marginTop: 32,
        marginBottom: 30,
        overflow: 'hidden',
        borderRadius: 15,
    },
    camera: {
        flex: 1,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
        color: '#FFFFFF',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    scanArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    targetBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    scanText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    }
});