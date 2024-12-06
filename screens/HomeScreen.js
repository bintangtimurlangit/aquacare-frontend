import React from 'react';
import Home from '../components/Home';
import { useRoute } from "@react-navigation/native";

export default function HomeScreen() {
    const route = useRoute();
    // const { aquariumName, deviceToken } = route.params;

    const aquariumName = "Bintang";
    const deviceToken = "1234567890";

    return (
        <Home
            aquariumName={aquariumName}
            deviceToken={deviceToken}
        />
    );
}