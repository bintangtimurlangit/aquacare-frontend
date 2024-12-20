import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { DeviceProvider } from '../context/DeviceContext';
import { SocketProvider } from '../context/SocketContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <DeviceProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack>
        </DeviceProvider>
      </SocketProvider>
    </AuthProvider>
  );
}