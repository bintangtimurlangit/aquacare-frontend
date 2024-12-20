import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { DeviceProvider } from '../context/DeviceContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <DeviceProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </DeviceProvider>
    </AuthProvider>
  );
}