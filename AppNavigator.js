import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import DeviceScanScreen from "./screens/DeviceScanScreen";
import DeviceAddScreen from "./screens/DeviceAddScreen";
import AdvancedScreen from "./screens/AdvancedScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="DeviceScan">
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
                name="DeviceScan"
                component={DeviceScanScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DeviceAdd"
                component={DeviceAddScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Advanced"
                component={AdvancedScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
