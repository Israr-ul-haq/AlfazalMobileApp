import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useContext } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import AsyncService from "../Services/AsyncStorage";
import AppContext from "../Helpers/UseContextStorage";

function WelcomeScreen() {
  const navigation = useNavigation();

  const { setIsWelcomeScreen } = useContext(AppContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncService.isLoggedIn();

      setTimeout(() => {
        if (loggedIn) {
          navigation.navigate("Main");
        } else {
          navigation.navigate("GettingStarted");
        }
        setIsWelcomeScreen(true);
      }, 3000);
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo-placeholder.png")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  logo: {
    width: 200,
    height: 200,
    objectFit: "contain",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WelcomeScreen;
