import { Stack } from 'expo-router';

export default function DeviceLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen 
                name="advanced"
                options={{
                    title: 'Advanced'
                }}
            />
        </Stack>
    );
} 