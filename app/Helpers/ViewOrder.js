import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import BoilingGif from "../assets/boiling.gif";
import Rider from "../assets/Rider.gif";

function ViewOrder() {
  const [isRider, setIsRider] = useState(false);

  return (
    <>
      <View style={styles.text_contains}>
        <CustomText bold={false} style={styles.main_heading}>
          {isRider ? "Your Rider is on the way" : "  Your Food Is preparing"}
        </CustomText>
        <CustomText style={styles.timeHeading}>Time 30min</CustomText>
      </View>
      <View style={styles.gif_contains}>
        <Image source={isRider ? Rider : BoilingGif} />
        <CustomText bold={false} style={styles.gif_tag}>
          {isRider
            ? "Will Received your Order Soon"
            : "Rider Will Pick your Order Soon"}
        </CustomText>
      </View>
      <CustomText bold={true}>Order Details</CustomText>
      <View style={styles.font_contains}>
        <CustomText style={styles.font_size}>Order Number</CustomText>
        <CustomText>#1527B</CustomText>
      </View>
      <View style={styles.font_contains}>
        <CustomText style={styles.font_size}>Delivery Address</CustomText>
        <View style={styles.div_width}>
          <CustomText>B-block #123 lahore</CustomText>
        </View>
      </View>
      <View style={styles.font_contains}>
        <CustomText style={styles.font_size}>Delivery Charges</CustomText>
        <CustomText>150</CustomText>
      </View>
      <View style={styles.border_line}></View>
      <View style={styles.font_contains_total}>
        <CustomText style={styles.font_size} bold={true}>
          Total
        </CustomText>
        <CustomText bold={true}>350</CustomText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
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
  div_width: {
    width: 120,
  },

  gif_tag: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 30,
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
