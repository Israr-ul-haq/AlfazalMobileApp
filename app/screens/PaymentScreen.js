import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Header from "../Helpers/Header";
import { Edit, Location } from "../Helpers/SVGs";
import CustomText from "../Helpers/CustomText";
import MapImage from "../assets/Map.png";
import PaymentCardOptions from "../Helpers/PaymentCardOptions";
import SubTotalCard from "../Helpers/SubTotalCard";
import AppContext from "../Helpers/UseContextStorage";

function PaymentScreen() {
  const { grandTotal } = useContext(AppContext);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Payment"} isBack={true} navigateUrl={"Cart"} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.container}>
          <View style={styles.address_contain}>
            <Location />
            <CustomText bold={false} style={styles.address}>
              Venture Republic FF Sector, Lahore
            </CustomText>
            <TouchableOpacity style={styles.button}>
              <View style={styles.edit_contains}>
                <Edit />
              </View>
            </TouchableOpacity>
          </View>
          <Image source={MapImage} style={styles.map_Image} />
          <View style={styles.payment}>
            <CustomText bold={false} style={styles.address}>
              Edit Payment Method
            </CustomText>
            <TouchableOpacity style={styles.button}>
              <View style={styles.edit_contains}>
                <Edit />
              </View>
            </TouchableOpacity>
          </View>
          <PaymentCardOptions />
        </View>
        <SubTotalCard pageNavigate={"Order"} grandTotal={grandTotal} />
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

  edit_contains: {
    padding: 5,
    backgroundColor: "#FED7D7",
    borderRadius: 5,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  address_contain: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  payment: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  border_line: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C43E1A",
    marginBottom: 32,
  },

  map_Image: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 10,
  },

  address: {
    fontSize: 10,
  },

  payment__card: {
    marginTop: 15,
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  pay_text: {
    fontSize: 16,
  },

  pay_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default PaymentScreen;
