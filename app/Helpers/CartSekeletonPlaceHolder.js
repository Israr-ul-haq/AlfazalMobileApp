import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const CartSkeletonPlaceholder = () => {
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
        {Array.from({ length: 3 }, (_, index) => (
          <View style={styles.container} key={`skeleton_${index}`}>
            <Animated.View
              style={[
                styles.avatar,
                styles.skeletonItem,
                { opacity: opacityValue },
              ]}
            />
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: "100%",
    height: 130,
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
    width: "100%", // Adjust this width as needed to create space between cards
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

export default CartSkeletonPlaceholder;
