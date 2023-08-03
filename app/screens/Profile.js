import React, { useState } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import Header from "../Helpers/Header";
import PlaceHolder from "../assets/PlaceHolder.png";
import { Edit, LocationMap, Mail, Person } from "../Helpers/SVGs";
import CustomText from "../Helpers/CustomText";
import CustomDropdown from "../Helpers/CustomDropdown";
import { useNavigation } from "@react-navigation/native";
function Profile() {
  const navigation = useNavigation();
  const dropdowns = [
    {
      label: "User name",
      options: "stephen Charles",
      icon: <Person />,
    },
    {
      label: "Email",
      options: "test@gmail.com",
      icon: <Mail />,
    },
    {
      label: "Gender",
      options: "Male",
      icon: <Person />,
    },
    {
      label: "Location",
      options: "Address",
      icon: <LocationMap />,
    },
  ];

  const navigateUrl = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header isBack={false} text={"My Profile"} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.container}>
          <View style={styles.flex_row}>
            <View style={styles.imageContains}>
              <Image source={PlaceHolder} style={styles.previewImage} />
              <TouchableOpacity style={styles.button} onPress={navigateUrl}>
                <View style={styles.edit_contains}>
                  <Edit />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.textContains}>
              <CustomText style={styles.text_size} bold={true}>
                StephenCharles
              </CustomText>
              <CustomText style={styles.text_size} bold={false}>
                stephen541@gmail.com
              </CustomText>
            </View>
          </View>

          {dropdowns?.map((i, index) => {
            return <CustomDropdown data={i} key={index} />;
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },

  edit_contains: {
    padding: 5,
    backgroundColor: "#FED7D7",
    borderRadius: 5,
    width: 20,
  },

  imageContains: {
    position: "relative",
    width: "30%",
  },

  textContains: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  flex_row: {
    flexDirection: "row",
  },

  button: {
    position: "absolute",
    right: 0,
    bottom: 20,
  },

  background: {
    flex: 1,
    backgroundColor: "white",
  },
  previewImage: {
    width: 110,
    height: 110,
    marginTop: 0,
    resizeMode: "cover",
    borderRadius: 100,
    borderWidth: 1,
  },

  text_size: {
    fontSize: 14,
  },
});

export default Profile;
