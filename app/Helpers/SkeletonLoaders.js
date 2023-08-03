import React, { useRef, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Animated } from "react-native";

const SkeletonPlaceholder = () => {
  const opacityValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000, // Adjust the duration to control the speed of the animation
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 1000, // Adjust the duration to control the speed of the animation
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <>
      <View style={styles.cardsContainer}>
        {Array.from({ length: 10 }, (_, index) => (
          <View style={styles.container} key={`skeleton_${index}`}>
            <Animated.View
              style={[
                styles.avatar,
                styles.skeletonItem,
                { opacity: opacityValue },
              ]}
            />
            <View style={styles.textContainer}>
              <Animated.View
                style={[
                  styles.textLine,
                  styles.skeletonItem,
                  { opacity: opacityValue },
                ]}
              />
              <Animated.View
                style={[
                  styles.textLine,
                  styles.skeletonItem,
                  { opacity: opacityValue },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 120,
    borderRadius: 5,
    borderRadius: 5,
    marginRight: 20,
    backgroundColor: "#F5F5F9", // Replace with your skeleton color
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  container: {
    width: "48%", // Adjust this width as needed to create space between cards
    marginBottom: 20, // Add some margin between cards
  },

  textLine: {
    width: 150,
    height: 10,
    backgroundColor: "#F5F5F9", // Replace with your skeleton color
    marginTop: 10,
  },
  skeletonItem: {
    backgroundColor: "#EAEAEA",
  },
});

export default SkeletonPlaceholder;
