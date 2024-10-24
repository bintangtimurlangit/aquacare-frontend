import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, deviceToken: initialDeviceToken }) => {
    const [temperature, setTemperature] = useState(null);
    const [ph, setPh] = useState(null);
    const [water, setWater] = useState(null);
    const [deviceToken, setDeviceToken] = useState(initialDeviceToken); // add setDeviceToken here

    useEffect(() => {
        if (!deviceToken) return;

        const websocket = new WebSocket('ws://192.168.31.218:4000');

        websocket.onopen = () => {
            console.log('WebSocket Client Connected');
            websocket.send(JSON.stringify({ token: deviceToken }));
            console.log('Device Token for WebSocket:', deviceToken);
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data from WebSocket:', data);

            const temperatureData = [];
            const phData = [];
            const waterData = [];

            data.forEach((reading) => {
                if (reading.type === 'temp') {
                    temperatureData.push(parseFloat(reading.value));
                } else if (reading.type === 'ph') {
                    phData.push(parseFloat(reading.value));
                } else if (reading.type === 'water') {
                    waterData.push(parseFloat(reading.value));
                }
            });

            if (temperatureData.length > 0) {
                setTemperature(temperatureData[temperatureData.length - 1]);
            }
            if (phData.length > 0) {
                setPh(phData[phData.length - 1]);
            }
            if (waterData.length > 0) {
                setWater(waterData[waterData.length - 1]);
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        return () => {
            websocket.close();
        };
    }, [deviceToken]);

    return (
        <WebSocketContext.Provider value={{ temperature, ph, water, setDeviceToken }}>
            {children}
        </WebSocketContext.Provider>
    );
};
