import React from "react";
import { TouchableOpacity } from "react-native";
import { Arrow } from "./SVGs";
import { View } from "react-native";
import CustomText from "./CustomText";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

function OuterHeader({ navigateUrl, text }) {
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.navigate(navigateUrl);
  };
  return (
    <TouchableOpacity onPress={navigateBack}>
      <View style={styles.fixedTop}>
        <Arrow />
        <CustomText style={styles.mainText} bold={true}>
          {text}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fixedTop: {
    paddingTop: 50, // Adjust the top padding to create space between the status bar and your fixed content
    paddingLeft: 20,
    backgroundColor: "#C43E1A",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 1000,
  },

  mainText: {
    fontSize: 33,
    color: "white",
  },
});

export default OuterHeader;
