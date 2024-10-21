import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AddDeviceScreen from "./screens/AddDeviceScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="AddDevice">
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddDevice"
                component={AddDeviceScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
