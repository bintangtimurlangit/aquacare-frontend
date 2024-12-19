import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function MainLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading || !isAuthenticated) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen 
                name="home/index"
                options={{
                    title: 'Home'
                }}
            />
            <Stack.Screen 
                name="advanced/index"
                options={{
                    title: 'Advanced'
                }}
            />
        </Stack>
    );
} 