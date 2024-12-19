import { StyleProp, View, ViewStyle, Text, StyleSheet } from "react-native";
import { useState } from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import React from "react";
import * as d3 from "d3";

export type LineGraphProps = {
    data: number[];
    color: {
        dark: string;
        light: string;
        nearWhite: string;
    };
    label: string;
    stat: string;
    style?: StyleProp<ViewStyle>;
};


const GRAPH_ASPECT_RATIO = 9 / 16;

export function LineGraph(props: LineGraphProps) {
    const [width, setWidth] = useState(0);

    const height = width * GRAPH_ASPECT_RATIO;
    const graphHeight = (height * 2) / 3;

    const min = Math.min(...props.data);
    const max = Math.max(...props.data);

    const yScale = d3.scaleLinear().domain([min, max]).range([graphHeight, 0]);

    const xScale = d3
        .scaleLinear()
        .domain([0, props.data.length - 1])
        .range([0, width]);

    const lineOffset = -20;

    const lineMaxHeightOffset = 30;
    const lineYScale = d3.scaleLinear().domain([min, max]).range([graphHeight - lineMaxHeightOffset, 0]);

    const lineFn = d3
        .line<number>()
        .x((d, ix) => xScale(ix))
        .y((d) => lineYScale (d) - lineOffset);

    const areaFn = d3
        .area<number>()
        .x((d, ix) => xScale(ix))
        .y0(height)
        .y1((d, ix) => lineYScale (d) - lineOffset);

    const svgLine = lineFn(props.data);
    const svgArea = areaFn(props.data);

    const darkHexColor = props.color.dark;
    const lightHexColor = props.color.light;
    const nearlyWhiteHexColor = props.color.nearWhite;

    return (
        <View
            style={[styles.container, props.style]}
            onLayout={(ev) => {
                setWidth(ev.nativeEvent.layout.width);
            }}
        >
            <View style={{ height: height - graphHeight }}>
                <View style={styles.labelContainer}>
                    <Text numberOfLines={1} style={styles.labelText}>
                        {props.label}
                    </Text>
                    <View style={styles.statContainer}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statText}>
                            {props.stat}
                        </Text>
                    </View>
                </View>
            </View>
            <Svg width={width} height={graphHeight}>
                <Defs>
                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="80%">
                        <Stop offset={"0%"} stopColor={lightHexColor} stopOpacity={1} />
                        <Stop offset={"100%"} stopColor={nearlyWhiteHexColor} stopOpacity={0} />
                    </LinearGradient>
                </Defs>
                <Path d={svgLine} stroke={darkHexColor} fill={"none"} strokeWidth={2} />
                <Path d={svgArea} stroke={"none"} fill={"url(#gradient)"} />
            </Svg>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0B192C",
        borderRadius: 25,
        overflow: 'hidden',
    },
    labelContainer: {
        padding: 16,
    },
    labelText: {
        color: "#ffffff",
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "500",
    },
    statContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
    },
    statText: {
        fontSize: 32,
        color: "#A5D7E8",
        fontWeight: "bold",
    },
});
