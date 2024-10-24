import { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, deviceToken: initialDeviceToken }) => {
    const [temperatureData, setTemperatureData] = useState([]); // Store entire temperature data
    const [phData, setPhData] = useState([]); // Store entire pH data
    const [waterData, setWaterData] = useState([]); // Store entire water data
    const [deviceToken, setDeviceToken] = useState(initialDeviceToken);

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

            let newTemperatureData = [];
            let newPhData = [];
            let newWaterData = [];

            data.forEach((reading) => {
                if (reading.type === 'temp') {
                    newTemperatureData.push(parseFloat(reading.value));
                } else if (reading.type === 'ph') {
                    newPhData.push(parseFloat(reading.value));
                } else if (reading.type === 'water') {
                    newWaterData.push(parseFloat(reading.value));
                }
            });

            // Update temperature data only if there's a new value
            if (newTemperatureData.length > 0) {
                const latestTemperature = newTemperatureData[newTemperatureData.length - 1];
                if (latestTemperature !== temperatureData[temperatureData.length - 1]) {
                    setTemperatureData((prev) => [...prev, latestTemperature]); // Add only new data
                }
            }
            // Update pH data only if there's a new value
            if (newPhData.length > 0) {
                const latestPh = newPhData[newPhData.length - 1];
                if (latestPh !== phData[phData.length - 1]) {
                    setPhData((prev) => [...prev, latestPh]); // Add only new data
                }
            }
            // Update water data only if there's a new value
            if (newWaterData.length > 0) {
                const latestWater = newWaterData[newWaterData.length - 1];
                if (latestWater !== waterData[waterData.length - 1]) {
                    setWaterData((prev) => [...prev, latestWater]); // Add only new data
                }
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
        <WebSocketContext.Provider
            value={{
                temperature: temperatureData[temperatureData.length - 1],
                ph: phData[phData.length - 1],
                water: waterData[waterData.length - 1],
                temperatureData, // Provide the entire array
                phData,          // Provide the entire array
                waterData,       // Provide the entire array
                setDeviceToken
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};