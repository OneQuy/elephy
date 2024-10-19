import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

// Define prop types for the component
interface ColorChangingViewProps {
    colors: string[];   // Array of colors for the background transitions
    duration?: number;  // Optional duration for each transition (in ms)
    style?: ViewStyle;  // Optional custom styles for the view
    children?: React.ReactNode; // Children elements to render inside the view
}

const ColorChangingView: React.FC<ColorChangingViewProps> = ({
    colors,
    duration = 5000,
    style,
    children,
}) => {
    const colorAnimation = useRef(new Animated.Value(0)).current;
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
        // colorAnimation.setValue(0); // Reset animation value

        // Function to trigger the next color animation
        const animateColor = () => {
            Animated.timing(colorAnimation, {
                toValue: 1, // Animate from 0 to 1 for each transition
                duration: duration,
                useNativeDriver: false, // Can't use native driver with colors
            }).start(() => {
                setColorIndex((colorIndex + 1) % colors.length); // Move to the next color
                colorAnimation.setValue(0); // Reset animation value

                // console.log(colors[colorIndex]);
            });
        };

        animateColor(); // Start animation on mount
    }, [colorIndex, duration]);

    // Interpolate between the current color and the next color
    const interpolatedColor = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [colors[colorIndex], colors[(colorIndex + 1) % colors.length]],
    });

    return (
        <Animated.View style={[styles.container, style, { backgroundColor: interpolatedColor }]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ColorChangingView;