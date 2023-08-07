import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import PlaceHolder from "../assets/PlaceHolder.png";
import { Arrow } from "./SVGs";
import { useNavigation } from "@react-navigation/native";

import AppContext from "./UseContextStorage";
import { baseURL } from "../Constants/axios.config";
import { getCartItems } from "../Services/CartService";

function Header({ text, isBack, navigateUrl }) {
  const navigation = useNavigation();

  const { user, setCartCount } = useContext(AppContext);

  const navigateBack = () => {
    navigation.navigate(navigateUrl);
  };

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  /// Cart Data

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getCartItems(user._id);
      const newData = response.data.totalCount;
      setCartCount(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <View style={styles.header_wrap}>
      {isBack && (
        <TouchableOpacity onPress={navigateBack}>
          <View style={styles.arrow_btn}>
            <Arrow />
          </View>
        </TouchableOpacity>
      )}
      <CustomText style={styles.HeaderText} bold={true}>
        {text}
      </CustomText>
      <TouchableOpacity onPress={navigateProfile}>
        <Image
          source={{
            uri: user?.img ? baseURL + user?.img : PlaceHolder,
          }}
          style={styles.header_Image}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: 600,
    paddingLeft: 20,
  },
  header_wrap: {
    paddingTop: 55,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#B22310",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 1000,
    paddingBottom: 20,
  },
  header_Image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 20,
  },

  arrow_btn: {
    paddingTop: 10,
    marginLeft: 20,
    width: 35,
    height: 35,
  },
});

export default Header;
