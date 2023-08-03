import React from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import Button from "./Buttons";
import { useNavigation } from "@react-navigation/native";

function SubTotalCard({ pageNavigate }) {
  const navigation = useNavigation();
  const redirect = () => {
    navigation.navigate(pageNavigate);
  };

  return (
    <View style={styles.total_bill}>
      <View style={styles.border_line}></View>
      <View style={[styles.pt30, styles.total_text]}>
        <CustomText bold={true}>Sub Total</CustomText>
        <CustomText bold={true}>Rs: 3567</CustomText>
      </View>
      <View style={[styles.pt20, styles.total_text]}>
        <CustomText bold={false} style={styles.font14}>
          Delivery Charges
        </CustomText>
        <CustomText bold={false} style={styles.font14}>
          Rs: 150
        </CustomText>
      </View>
      <View style={styles.border}></View>

      <View style={[styles.pt30, styles.total_text]}>
        <CustomText bold={true}>Sub Total</CustomText>
        <CustomText bold={true}>Rs: 3567</CustomText>
      </View>
      <View style={styles.pt30}>
        <Button onPressOk={redirect} title="Pay Now" isButtonFirst={true} />
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
});
export default SubTotalCard;
