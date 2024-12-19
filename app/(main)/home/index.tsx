import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CircularProgress from 'react-native-circular-progress-indicator';
import { router } from "expo-router";

export default function Home() {
    // Example static data (replace with your state management solution later)
    const temperature = 27.5;
    const ph = 7.2;
    const water = 85;
    const aquariumName = "Bintang";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.badgeContainer}>
                    <View style={styles.blueDot} />
                    <Text style={styles.badgeText}>CONNECTED</Text>
                </View>
            </View>

            <View style={styles.wrapper}>
                <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
                    {aquariumName + "'s Aquarium"}
                </Text>
            </View>

            <View style={styles.headerInfo}>
                <View style={styles.headerInfoContainer}>
                    <Text style={styles.badgeText}>Upcoming Feeding Time: 08.00 WIB</Text>
                </View>
            </View>
            
            <LinearGradient
                colors={['#0F0F0F', "#0b2447"]}
                style={styles.footerWrapper}>
                <View style={styles.circularProgressWrapper}>
                    <CircularProgress
                        value={ph}
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
                        value={temperature}
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
                        value={water}
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
                    onPress={() => router.push("/(main)/advanced")}
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
    }
});
