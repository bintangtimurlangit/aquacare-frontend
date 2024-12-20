import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen 
                name="index"
                options={{
                    title: 'Home'
                }}
            />
            <Stack.Screen 
                name="[deviceId]"
                options={{
                    title: 'Device'
                }}
            />
        </Stack>
    );
} 