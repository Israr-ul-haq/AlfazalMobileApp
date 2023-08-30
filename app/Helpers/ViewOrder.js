import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import CustomText from "../Helpers/CustomText";
import BoilingGif from "../assets/boiling.gif";
import Rider from "../assets/bike.gif";
import check from "../assets/check.png";
import reject from "../assets/close.png";

function ViewOrder({ orderData }) {
  return (
    <>
      <View style={styles.text_contains}>
        <CustomText bold={false} style={styles.main_heading}>
          {orderData?.orderStatus === "pending"
            ? "Pending"
            : orderData?.orderStatus === "preparing"
            ? "Preparing"
            : orderData?.orderStatus === "accept"
            ? "Accepted"
            : orderData?.orderStatus === "reject"
            ? "Rejected"
            : orderData?.orderStatus === "onWay"
            ? "Oneway"
            : ""}
        </CustomText>

        {/* <CustomText style={styles.timeHeading}>Time 30min</CustomText> */}
      </View>
      <View style={styles.gif_contains}>
        {orderData?.orderStatus === "pending" ? (
          <CustomText>Please stand by...</CustomText>
        ) : orderData?.orderStatus === "preparing" ? (
          <Image source={BoilingGif} />
        ) : orderData?.orderStatus === "accept" ? (
          <Image source={check} />
        ) : orderData?.orderStatus === "reject" ? (
          <Image source={reject} style={styles.rejectIcon} />
        ) : orderData?.orderStatus === "onWay" ? (
          <Image source={Rider} style={styles.rejectIcon} />
        ) : (
          ""
        )}
        <CustomText bold={false} style={styles.gif_tag}>
          {orderData?.orderStatus === "pending"
            ? "your order is pending admin approval"
            : orderData?.orderStatus === "preparing"
            ? "Your Food Is preparing"
            : orderData?.orderStatus === "accept"
            ? "Your Order Accepted by Admin"
            : orderData?.orderStatus === "reject"
            ? "Sorry Your Order Request Got Rejected"
            : orderData?.orderStatus === "onWay"
            ? "Your Rider is on the way"
            : ""}
        </CustomText>
      </View>
      <CustomText bold={true}>Order Details</CustomText>
      <View style={styles.font_contains}>
        <CustomText style={styles.font_size}>Order Number</CustomText>
        <CustomText>{orderData?.orderId}</CustomText>
      </View>
      <View style={styles.delivery}>
        <CustomText style={styles.font_size}>Location</CustomText>
        <View style={styles.div_width}>
          <CustomText style={styles.font_text}>
            {orderData?.address?.mapAddress}
          </CustomText>
        </View>
      </View>
      <View style={styles.delivery}>
        <CustomText style={styles.font_size}>Home Address</CustomText>
        <View style={styles.div_width}>
          <CustomText style={styles.font_text}>
            {orderData?.address?.fullAddress}
          </CustomText>
        </View>
      </View>
      <View style={styles.font_contains}>
        <CustomText style={styles.font_size}>Delivery Charges</CustomText>
        <CustomText>{orderData?.deliveryCharges}</CustomText>
      </View>
      <View style={styles.border_line}></View>
      <View style={styles.font_contains_total}>
        <CustomText style={styles.font_size} bold={true}>
          Total
        </CustomText>
        <CustomText bold={true}>{orderData?.totalAmount}</CustomText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },

  font_text: {
    fontSize: 12,
  },

  rejectIcon: {
    width: 120,
    height: 120,
  },
  input: {
    borderWidth: 1,
    borderColor: "#C43E1A",
    borderRadius: 5,
    textAlignVertical: "top",
    paddingLeft: 10,
    paddingTop: 10,
    width: "100%",
    marginTop: 10,
    marginBottom: 50,
  },

  scrollView: {
    flexGrow: 1,
  },

  scrollView: {
    flexGrow: 1,
  },

  main_heading: {
    fontSize: 14,
    color: "#57585B",
  },
  container: {
    paddingHorizontal: 20,
  },

  timeHeading: {
    color: "#B22310",
    fontSize: 14,
  },

  text_contains: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 30,
  },
  gif_contains: {
    alignItems: "center",
    marginTop: 20,
  },

  gif_tag: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 30,
    textAlign: "center",
  },

  font_size: {
    fontSize: 14,
  },

  border_line: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C43E1A",
    marginBottom: 32,
  },

  font_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  font_contains_total: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 50,
  },

  /////MOdal styling start
  modal_backGround: {
    backgroundColor: "white",
    padding: 25,
    width: 320,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },

  pb30: {
    paddingBottom: 30,
  },
  pb25: {
    paddingBottom: 25,
  },

  font__size: {
    fontSize: 14,
    alignItems: "flex-start",
    width: "100%",
  },

  view_width: {
    width: "100%",
  },
});

export default ViewOrder;
