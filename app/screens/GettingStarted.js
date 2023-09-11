import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import CustomText from "../Helpers/CustomText";
import Button from "../Helpers/Buttons";
import { useNavigation } from "@react-navigation/native";

function GettingStarted() {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate("Login");
  };

  const redirect = () => {
    navigation.navigate("SignUp");
  };

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
        source={require("../assets/logo-placeholder.png")}
        resizeMode="contain"
      />
      <View style={styles.mainTextConatiner}>
        <CustomText style={styles.mainText} bold={true}>
          Grab Fast Your Sweet Snacks
        </CustomText>
      </View>

      <View>
        <Button
          onPressOk={handleButtonPress}
          onPressCancel={redirect}
          title="Get Started"
          title2="Create Account"
          isMultiButton={true}
        />
      </View>
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
  mainText: {
    top: 50,
    fontSize: 30,
    lineHeight: 44,
    textAlign: "center",
  },
  mainTextConatiner: {
    width: 330,
    flex: 1,
    alignItems: "center",
    textAlign: "center",
  },
});

export default GettingStarted;
