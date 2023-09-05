import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  BackHandler,
} from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import ViewOrder from "../Helpers/ViewOrder";
import { getOrderByUserId } from "../Services/OrderService";
import { useFocusEffect } from "@react-navigation/native";
import AppContext from "../Helpers/UseContextStorage";
import { ActivityIndicator } from "react-native";

function OrderScreen() {
  const { user, orderData, setOrderData } = useContext(AppContext);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Do nothing when the user is on the Home screen (or the desired logged-in screen)
        // You can add logic here to prompt the user to log out, if needed.
        return true; // Return true to prevent the default back button behavior
      }
    );

    return () => {
      backHandler.remove(); // Clean up the event listener when the component unmounts
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    setLoader(true);
    const response = await getOrderByUserId(user._id);

    if (response.status === 200) {
      setOrderData(response?.data[0]);
      console.log(response);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Order"} isBack={true} navigateUrl={"Home"} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.container}>
          {loader ? (
            <>
              <ActivityIndicator
                size="large"
                color="red"
                style={styles.spinner}
              />
            </>
          ) : orderData ? (
            <ViewOrder orderData={orderData} />
          ) : (
            <CustomText bold={false} style={styles.order_none}>
              No active orders
            </CustomText>
          )}
          {/* <Button onPressOk={openModal} title="Rate Us" isButtonFirst={true} /> */}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollView: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 20,
  },
  spinner: {
    paddingTop: 130,
  },
  order_none: {
    textAlign: "center",
    verticalAlign: "middle",
    justifyContent: "center",
    paddingVertical: 150,
  },
});

export default OrderScreen;
