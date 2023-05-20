import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
// import CustomText from "../../CustomText";

function GettingStarted() {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/GettingStartedBanner.png")}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <View style={styles.overlay}></View>
      </View>
      <Image
        style={styles.logo}
        source={require("../assets/logo.png")}
        resizeMode="contain"
      />
      {/* <CustomText>New</CustomText> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageWrapper: {
    width: 375,
    height: 425,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 340,
    left: -45,
    right: 0,
    height: 1000, // Adjust the height to match the width of the container
    width: 465, // Adjust the width to match the width of the container
    backgroundColor: "#fff", // Set the background color if needed
    borderRadius: 250, // Make the borderRadius half the width of the container
  },
  logo: {
    width: 165,
    height: 100,
    position: "absolute",
    alignSelf: "center", // Align the logo horizontally to the center
    top: 360, // Adjust the top position to ensure the logo is visible
  },
});

export default GettingStarted;
