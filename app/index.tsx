import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/images/onboarding1.png'),
    title: 'Control, anytime, anywhere.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding2.png'),
    title: 'For a healthier aquarium.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding3.png'),
    title: 'Worry-free, \neasy to use.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentTitle, setCurrentTitle] = useState('Control, anytime, anywhere.');

  const handleSkip = () => {
    const lastImageIndex = slides.length - 1;
    const scrollToPosition = lastImageIndex * width;
    scrollViewRef.current?.scrollTo({ x: scrollToPosition, animated: true });
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentTitle(slides[index]?.title || slides[0].title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to AquaCare!</Text>
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
          {slides.map((slide, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={slide.image} style={styles.image} />
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.wrapper}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>
            Already have an account?{'  '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
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
      fontWeight: '500',
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
      height: '45%',
    },
    imageWrapper: {
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      resizeMode: 'contain',
      width: width - 64,
      height: '80%',
      borderRadius: 16
    },
    wrapper: {
      marginHorizontal: 32,
      paddingHorizontal: 5,
    },
    contentWrapper: {
    },
    buttonContainer: {
      width: '100%',
      marginTop: 20,
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
      marginTop: 15,
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
    pagination: {
      flexDirection: 'row',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      height: 8,
      borderRadius: 4,
      backgroundColor: '#A5D7E8',
      marginHorizontal: 4,
    },
  });
  