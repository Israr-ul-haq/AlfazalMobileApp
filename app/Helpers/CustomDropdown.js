import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { ArrowMenu } from "./SVGs";
import CustomText from "./CustomText";

function CustomDropdown({ data }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const rotationAngle = useState(new Animated.Value(0))[0];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.timing(rotationAngle, {
      toValue: showDropdown ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateArrow = rotationAngle.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });
  return (
    <>
      <TouchableOpacity style={styles.text_contain} onPress={toggleDropdown}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {data.icon}
          <CustomText style={styles.text} bold={false}>
            {data.label}
          </CustomText>
        </View>
        <Animated.View
          style={[
            styles.arrowContainer,
            { transform: [{ rotate: rotateArrow }] },
          ]}
        >
          <ArrowMenu />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.border_bottom}></View>
      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <CustomText style={styles.dropdownText}>{data.options}</CustomText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text_contain: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  border_bottom: {
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
    marginTop: 15,
  },

  dropdownText: {
    fontSize: 14,
  },
});

export default CustomDropdown;
