import React from "react";
import { Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

const CustomText = ({ children, style, ...rest }) => {
  const [fontsLoaded] = useFonts({
    PoppinsBlack: require("./App/assets/Poppins/Poppins-Black.ttf"),
    PoppinsBold: require("./App/assets/Poppins/Poppins-Bold.ttf"),
  });

  const textStyle = [styles.text, style];

  if (fontsLoaded) {
    // Apply the Poppins font if the fonts are loaded
    textStyle.push({ fontFamily: "PoppinsBlack" });
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
