import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type pimples = {
    skincare_ID: number;
    mean_value: number;
};

interface AvgChartProps {
    data: pimples[];
}

export const AvgChart = ({ data }: AvgChartProps) => {
    const { width: windowWidth } = useWindowDimensions();
    const BarChartWidth = windowWidth * 0.16;
    const BarChartGap = 7;
    const BarWidth = (BarChartWidth - BarChartGap * (data.length - 1)) / data.length;
    const maxValue = Math.max(...data.map((d) => d.mean_value));
    const BarMaxHeight = 150; // Adjust this as needed
    const scaleFactor = BarMaxHeight / maxValue;

    if(data.length === 0) {
        return (
            <View style={styles.container2}>
                <Text style={styles.label}>No data yet. Start a skincare routine to track your progress!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {data.map((d) => {
                const animatedHeight = useSharedValue(0);

                // Start animation
                React.useEffect(() => {
                    animatedHeight.value = withTiming(d.mean_value * scaleFactor, {
                        duration: 1500,
                    });
                }, [d.mean_value]);

                // Animated styles for the bar
                const animatedStyle = useAnimatedStyle(() => ({
                    height: animatedHeight.value,
                }));

                return (
                    <View key={d.skincare_ID} style={styles.barContainer}>
                        <Animated.View
                            key={d.skincare_ID}
                            style={[
                                {
                                    width: BarWidth,
                                    backgroundColor: 'rgba(66, 3, 61, 1)',
                                    borderRadius: 15,
                                    marginTop: 10,
                                },
                                animatedStyle,
                            ]}
                        >
                            <Text style={styles.textInsideBar}>{d.mean_value}</Text>
                        </Animated.View>
                        <Text style={ styles.label }>SC.{d.skincare_ID}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    barContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    label: {
        marginTop: 5, // Position the label below the bar
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    textInsideBar: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 7,
        zIndex: 10,
        justifyContent: 'center',
        marginBottom: 20,
    },
});
