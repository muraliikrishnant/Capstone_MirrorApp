import React, { useEffect, useRef } from "react";
import { TouchableWithoutFeedback, Animated, Easing, StyleSheet } from "react-native";

interface ToggleSwitchProps {
  value: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onToggle }) => {
  // Animated value: 0 = off, 1 = on
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
  }, [value]);

  // Interpolate background color from red (off) to green (on)
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["red", "green"],
  });

  // Interpolate the circle's horizontal position
  const circleTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjust as needed for proper positioning within the container
  });

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <Animated.View style={[styles.circle, { transform: [{ translateX: circleTranslateX }] }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "gray",
  },
});

export default ToggleSwitch;
