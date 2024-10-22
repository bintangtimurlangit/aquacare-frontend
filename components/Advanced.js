import {View, Text, TouchableOpacity, Image, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
import ArrowLeft from "../assets/icons/arrow-left.svg";
import React from "react";

export default function Advanced() {
    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <ArrowLeft height={30} width={30} style={{color: 'rgba(237, 237, 237, 0.7)'}} />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo-text.png')} style={styles.logo} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b2447',
        width: '100%',
        height: '100%',
    },
    header: {
        marginHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 66,
    },
    logo: {
        marginTop: 2,
        width: 76,
        height: 20,
        resizeMode: "contain",
    },
});