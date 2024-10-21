import {StyleSheet, Text, TouchableOpacity, Image, View, Dimensions, Animated} from 'react-native';
import React, { useRef, useState } from 'react';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import { useNavigation } from '@react-navigation/native';

export default function Onboarding() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [currentTitle, setCurrentTitle] = useState('Control, anytime, anywhere.');
    const navigation = useNavigation();

    const images = [
        { uri: 'https://via.placeholder.com/1480x1080.png?text=Placeholder+Image+1' },
        { uri: 'https://via.placeholder.com/1480x1080.png?text=Placeholder+Image+2' },
        { uri: 'https://via.placeholder.com/1480x1080.png?text=Placeholder+Image+3' },
    ];

    const titles = [
        'Control, anytime, anywhere.',
        'For a healthier aquarium.',
        'Worry-free, \neasy to use.',
    ];

    // Modified onScroll function to work with JS (no types)
    const onScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / (Dimensions.get('window').width - 74)); // Adjusted width
        setCurrentTitle(titles[index] || titles[0]);
    };

    const handleSkip = () => {
        const lastImageIndex = images.length - 1;
        const scrollToPosition = lastImageIndex * (Dimensions.get('window').width - 64);
        scrollViewRef.current?.scrollTo({ x: scrollToPosition, animated: true });
    };

    const handleLoginNavigation = () => {
        navigation.navigate('Login'); // Navigate to LoginScreen
    };

    const handleRegisterNavigation = () => {
        navigation.navigate('Register'); // Navigate to RegisterScreen
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome to Aquacare!</Text>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>{currentTitle}</Text>
            </View>

            <View style={styles.contentWrapper}>
                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                            useNativeDriver: false,
                            listener: onScroll
                        }
                    )}
                    scrollEventThrottle={16}
                    decelerationRate={'normal'}
                    style={styles.imageContainer}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={image} style={styles.image} />
                        </View>
                    ))}
                </Animated.ScrollView>

                <ExpandingDot
                    containerStyle={{ top: 450 }}
                    expandingDotWidth={30}
                    inActiveDotOpacity={1}
                    data={images}
                    dotStyle={styles.dotStyle}
                    scrollX={scrollX}
                />
            </View>

            <View style={styles.wrapper}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleRegisterNavigation}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>
                        Already have an account?{'  '}
                    </Text>
                    <TouchableOpacity onPress={handleLoginNavigation}>
                        <Text style={styles.loginText}>Log In</Text>
                    </TouchableOpacity>
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
        marginTop: 72,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'medium',
        color: 'rgba(237, 237, 237, 0.6)'
    },
    skipText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(237, 237, 237, 0.7)'
    },
    title: {
        fontSize: 42,
        textAlign: 'left',
        paddingTop: 20,
        color: '#FFFFFF'
    },
    imageContainer: {
        marginTop: 30,
        flexDirection: 'row',
        height: 400,
    },
    image: {
        resizeMode: 'cover',
        width: Dimensions.get('window').width - 74,
        height: '100%',
        borderRadius: 16
    },
    wrapper: {
        marginHorizontal: 32
    },
    imageWrapper: {
        paddingHorizontal: 5,
    },
    dotStyle: {
        width: 10,
        height: 10,
        backgroundColor: '#A5D7E8',
        borderRadius: 5,
        marginHorizontal: 5
    },
    contentWrapper: {
        marginHorizontal:32,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 65,
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
    loginText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
    },
});
