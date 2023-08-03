import React from "react";
import { Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

const CustomText = ({ children, style, bold, ...rest }) => {
  const [fontsLoaded] = useFonts({
    PoppinsBold: require("../Poppins/Poppins-Bold.ttf"),
    PoppinsRegular: require("../Poppins/Poppins-Regular.ttf"),
  });

  const textStyle = [styles.text, style];

  if (fontsLoaded) {
    // Apply the Poppins font if the fonts are loaded
    if (bold) {
      textStyle.push({ fontFamily: "PoppinsBold" });
    } else {
      textStyle.push({ fontFamily: "PoppinsRegular" });
    }
  }

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#000",
  },
});

export default CustomText;
