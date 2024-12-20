import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function MainLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen 
                name="home"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="settings"
                options={{
                    title: 'Settings'
                }}
            />
        </Stack>
    );
} 