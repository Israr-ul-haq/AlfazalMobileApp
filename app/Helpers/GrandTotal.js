import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import Button from "./Buttons";
import { useNavigation } from "@react-navigation/native";
import { CreateOrder } from "../Services/OrderService";

function GrandTotal({
  grandTotal,
  errors,
  redirect,
  deliveryCharges,
  finalPrice,
  loader,
}) {
  return (
    <View style={styles.total_bill}>
      <View style={styles.border_line}></View>
      <View style={[styles.pt30, styles.total_text]}>
        <CustomText bold={true}>Sub Total</CustomText>
        <CustomText bold={true}>Rs: {grandTotal}</CustomText>
      </View>
      <View style={[styles.pt20, styles.total_text]}>
        <CustomText bold={false} style={styles.font14}>
          Delivery Charges
        </CustomText>
        <CustomText bold={false} style={styles.font14}>
          Rs: {deliveryCharges}
        </CustomText>
      </View>
      <View style={styles.border}></View>

      <View style={[styles.pt30, styles.total_text]}>
        <CustomText bold={true}>Grand Total</CustomText>
        <CustomText bold={true}>Rs: {finalPrice}</CustomText>
      </View>

      <View style={styles.pt30}>
        {errors && (
          <CustomText style={styles.resErrortext} bold={false}>
            {errors.message}
          </CustomText>
        )}
        <Button
          onPressOk={redirect}
          title="Place Order"
          isButtonFirst={true}
          isLoading={loader}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  total_bill: {
    paddingHorizontal: 20,
  },

  border_line: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C43E1A",
  },

  pt30: {
    paddingTop: 30,
  },
  total_text: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  font14: {
    fontSize: 14,
  },

  border: {
    borderBottomWidth: 1,
    borderColor: "#C43E1A",
    marginTop: 15,
  },
  resErrortext: {
    color: "red",
    marginBottom: 8,
    fontSize: 10,
    textAlign: "center",
  },
});
export default GrandTotal;
