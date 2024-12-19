import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { deviceAPI } from '../../services/api/device';

export default function DeviceScan() {
    const { fromScreen } = useLocalSearchParams<{ fromScreen?: string }>();
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedCode, setScannedCode] = useState('');
    const [isScanning, setIsScanning] = useState(true);
    const processingRef = useRef(false);
    const [showNameModal, setShowNameModal] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [pendingDeviceId, setPendingDeviceId] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    const handleDeviceRegistration = async (deviceId: string, name: string) => {
        if (isRegistering) return;
        
        try {
            setIsRegistering(true);
            console.log('📱 Attempting to register device:', deviceId);
            await deviceAPI.registerDevice(deviceId, name);
            console.log('✅ Device registered successfully');
            
            // Navigate to home screen after successful registration
            router.push({
                pathname: "/(main)/home",
                params: { deviceId }
            });
        } catch (error: any) {
            console.error('❌ Device registration failed:', error);
            Alert.alert(
                'Registration Failed',
                error.response?.data?.error || 'Failed to register device'
            );
            resetScanningState();
        } finally {
            setIsRegistering(false);
        }
    };

    const resetScanningState = () => {
        setScannedCode('');
        setIsScanning(true);
        processingRef.current = false;
        setShowNameModal(false);
        setDeviceName('');
        setPendingDeviceId('');
    };

    const handleBarCodeScanned = (result: BarcodeScanningResult) => {
        if (!isScanning || scannedCode === result.data || processingRef.current) return;
        
        processingRef.current = true;
        setIsScanning(false);
        setScannedCode(result.data);
        setPendingDeviceId(result.data);
        setShowNameModal(true);
    };

    const DeviceNameModal = () => (
        <Modal
            visible={showNameModal}
            transparent={true}
            animationType="slide"
            onRequestClose={resetScanningState}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={[styles.modalContainer, { justifyContent: 'flex-end' }]}>
                    <View style={[styles.modalContent, { width: '100%', borderRadius: 15, marginHorizontal: 0 }]}>
                        <Text style={styles.modalTitle}>Name Your Device</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter device name"
                            placeholderTextColor="#666"
                            value={deviceName}
                            onChangeText={setDeviceName}
                            autoFocus={false}
                            returnKeyType="done"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.modalButton} 
                                onPress={resetScanningState}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.modalButton, 
                                    styles.primaryButton,
                                    isRegistering && styles.disabledButton
                                ]}
                                disabled={isRegistering}
                                onPress={() => {
                                    if (deviceName.trim()) {
                                        handleDeviceRegistration(pendingDeviceId, deviceName);
                                    } else {
                                        Alert.alert('Error', 'Please enter a device name');
                                    }
                                }}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {isRegistering ? 'Registering...' : 'Register'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );

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
                {fromScreen === 'select-device' && (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>←</Text>
                    </TouchableOpacity>
                )}
                <Image 
                    source={require('../../assets/images/logo.png')} 
                    style={styles.logo} 
                />
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
            <DeviceNameModal />
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
    backButton: {
        fontSize: 30,
        color: 'rgba(237, 237, 237, 0.7)',
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
        marginBottom: 70,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0b2447',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#000',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    primaryButton: {
        backgroundColor: '#0b2447',
    },
    buttonText: {
        color: '#0b2447',
        fontWeight: 'bold',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});