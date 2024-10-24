import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { WebSocketProvider } from './websocket/WebSocketContext';

export default function App() {
    const [deviceToken, setDeviceToken] = useState(null);

    return (
        <WebSocketProvider deviceToken={deviceToken}>
            <NavigationContainer>
                <AppNavigator setDeviceToken={setDeviceToken} />
            </NavigationContainer>
        </WebSocketProvider>
    );
}
