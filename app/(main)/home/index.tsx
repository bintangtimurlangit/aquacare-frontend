import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CircularProgress from 'react-native-circular-progress-indicator';
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { GLTFLoader, GLTF as GLTFType } from 'three/examples/jsm/loaders/GLTFLoader';
import { useDevice } from '../../../context/DeviceContext';
import SocketService from '../../../services/socket';
import MetricsStorageService from '../../../services/metricsStorage';

type GLTF = GLTFType;

interface MetricsData {
    deviceId: string;
    metrics: {
        id: string;
        deviceId: string;
        ph_level: number;
        water_level: number;
        temperature: number;
        timestamp: string;
    };
    timestamp: string;
}

// Create a separate interface for the metrics state
interface MetricsState {
    temperature: number;
    ph_level: number;
    water_level: number;
}

export default function DashboardScreen() {
    const [isConnected, setIsConnected] = useState(false);
    const { currentDevice } = useDevice();
    const [metrics, setMetrics] = useState<MetricsState>({
        temperature: 0,
        ph_level: 0,
        water_level: 0
    });
    const [lastUpdate, setLastUpdate] = useState<string>('');
    let animationFrameId: number;
    let gltfModel: GLTF | null = null;

    useEffect(() => {
        if (!currentDevice) {
            return;
        }

        // Connect with callbacks
        SocketService.connect({
            onMetricsUpdate: async (metrics) => {
                // Update state for display
                setMetrics({
                    temperature: Math.round(metrics.temperature),
                    ph_level: Math.round(metrics.ph_level),
                    water_level: Math.round(metrics.water_level)
                });
                setLastUpdate(metrics.timestamp);

                // Store metrics
                await MetricsStorageService.updateMetrics(currentDevice.id, {
                    temperature: metrics.temperature,
                    ph_level: metrics.ph_level,
                    water_level: metrics.water_level,
                    timestamp: metrics.timestamp
                });
            },
            onConnectionChange: setIsConnected,
            onLastUpdate: setLastUpdate
        });

        // Subscribe to device
        SocketService.subscribeToDevice(currentDevice.id);

        // Cleanup
        return () => {
            SocketService.unsubscribeFromDevice(currentDevice.id);
            SocketService.disconnect();
        };
    }, [currentDevice]);

    if (!currentDevice) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDeviceText}>No device selected</Text>
                <TouchableOpacity 
                    style={styles.selectDeviceButton}
                    onPress={() => router.push('/(main)/home/select-device')}
                >
                    <MaterialCommunityIcons name="fish" size={20} color="#A5D7E8" />
                    <Text style={styles.selectDeviceText}>Select Device</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const onContextCreate = async (gl: WebGLRenderingContext) => {
        const scene = new THREE.Scene();
        
        // Calculate aspect ratio
        const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        
        const camera = new THREE.PerspectiveCamera(
            50,
            aspectRatio, // This ensures proper aspect ratio
            0.1,
            1000
        );
        camera.position.set(0, 2, 7);
        camera.lookAt(0, 0, 0);

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x0b2447); // Match background color

        try {
            const asset = Asset.fromModule(require('../../../assets/3d/FishTank.glb'));
            await asset.downloadAsync();
            
            const loader = new GLTFLoader();
            gltfModel = await new Promise<GLTF>((resolve, reject) => {
                loader.load(
                    asset.uri,
                    (gltf) => resolve(gltf),
                    (progress) => console.log('Loading model...', progress),
                    (error) => reject(error)
                );
            });
            
            if (gltfModel.scene) {
                scene.add(gltfModel.scene);
                gltfModel.scene.position.set(0, -0.8, 0);
                gltfModel.scene.scale.set(1.5, 1.5, 1.5);
                gltfModel.scene.rotation.y = Math.PI / 4;
            }
        } catch (error) {
            console.error('Error loading model:', error);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (gltfModel?.scene) {
                gltfModel.scene.rotation.y += 0.002;
            }
            renderer.render(scene, camera);
            (gl as any).endFrameEXP();
        };
        animate();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.badgeContainer}>
                    <View style={[styles.blueDot, !isConnected && styles.blueDotDisconnected]} />
                    <Text style={styles.badgeText}>
                        {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                    </Text>
                </View>
            </View>

            <View style={styles.wrapper}>
                <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
                    {currentDevice?.name || "No Device Selected"}
                </Text>
            </View>

            <View style={styles.headerInfo}>
                <View style={styles.headerInfoContainer}>
                    <Text style={styles.badgeText}>
                        {lastUpdate ? `Last Update: ${new Date(lastUpdate).toLocaleTimeString()}` : 'Waiting for data...'}
                    </Text>
                </View>
            </View>

            <View style={styles.modelContainer}>
                <GLView
                    style={{ flex: 1 }}
                    onContextCreate={onContextCreate}
                />
            </View>

            <TouchableOpacity 
                onPress={() => router.push('/(main)/home/select-device')}
                style={styles.selectDeviceButton}
            >
                <MaterialCommunityIcons name="fish" size={20} color="#A5D7E8" />
                <Text style={styles.selectDeviceText}>Select Device</Text>
            </TouchableOpacity>

            <LinearGradient
                colors={['#0F0F0F', "#0b2447"]}
                style={styles.footerWrapper}>
                <View style={styles.circularProgressWrapper}>
                    <CircularProgress
                        value={metrics.ph_level}
                        radius={38}
                        duration={2000}
                        progressValueFontSize={14}
                        titleFontSize={8}
                        progressValueColor={'#A5D7E8'}
                        activeStrokeColor={'#A5D7E8'}
                        maxValue={14}
                        title={"PH"}
                        titleColor={'white'}
                        titleStyle={{fontWeight: 'bold'}}
                    />
                    <CircularProgress
                        value={metrics.temperature}
                        radius={38}
                        duration={2000}
                        progressValueColor={'#A5D7E8'}
                        activeStrokeColor={'#A5D7E8'}
                        valueSuffix={'°C'}
                        progressValueFontSize={14}
                        titleFontSize={8}
                        maxValue={50}
                        title={"TEMP"}
                        titleColor={'white'}
                        titleStyle={{fontWeight: 'bold'}}
                    />
                    <CircularProgress
                        value={metrics.water_level}
                        radius={38}
                        duration={2000}
                        progressValueColor={'#A5D7E8'}
                        progressValueFontSize={14}
                        titleFontSize={8}
                        activeStrokeColor={'#A5D7E8'}
                        maxValue={100}
                        valueSuffix={'%'}
                        title={"WATER"}
                        titleColor={'white'}
                        titleStyle={{fontWeight: 'bold'}}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                        if (currentDevice) {
                            router.push(`/(main)/home/${currentDevice.id}/advanced`);
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Advanced</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b2447',
    },
    badgeContainer: {
        marginTop: 66,
        backgroundColor: '#19376D',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems:'center',
    },
    header: {
        display:'flex',
        alignItems:'center',
        marginHorizontal: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    headerInfo: {
        display:'flex',
        alignItems:'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    headerInfoContainer: {
        marginTop: 16,
        backgroundColor: '#19376D',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems:'center',
        marginBottom: 36,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        letterSpacing: 0.5,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title: {
        fontSize: 42,
        textAlign: 'left',
        paddingTop: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    blueDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#A5D7E8',
        marginRight: 8,
        justifyContent: 'center',
    },
    blueDotDisconnected: {
        backgroundColor: '#FF6B6B', // Red color for disconnected state
    },
    wrapper: {
        marginHorizontal: 32,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#A5D7E8',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
        marginHorizontal: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#0B2447',
        fontWeight: 'bold',
        fontSize: 16
    },
    footerWrapper: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 500,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    circularProgressWrapper: {
        marginTop: 32,
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center',
        gap: 32,
        flexDirection: 'row'
    },
    selectDeviceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(165, 215, 232, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    selectDeviceText: {
        color: '#A5D7E8',
        fontSize: 14,
        fontWeight: '500',
    },
    modelContainer: {
        width: '100%',
        height: 370,
        backgroundColor: '#0b2447',
    },
    noDeviceText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 100,
    },
});
