import React from "react";
import { View, StyleSheet, Image } from "react-native";
import moment from "moment-timezone";

import CustomText from "./CustomText";

function CompletedOrders({ data, key }) {
  const formattedDate = moment(data?.createdOn)
    .tz("Asia/Karachi")
    .format("DD/MM/YYYY");
  const formattedTime = moment(data?.createdOn)
    .tz("Asia/Karachi")
    .format("hh:mm A");

  return (
    <View style={styles.CartCard} key={key}>
      <View style={styles.cart_inner_contain}>
        <View style={styles.text_content}>
          <CustomText bold={false} style={styles.card_text}>
            {data?.orderId}
          </CustomText>
          {data?.orderStatus === "complete" ? (
            <CustomText bold={false} style={styles.para}>
              Completed
            </CustomText>
          ) : (
            <CustomText bold={false} style={styles.para1}>
              Rejected
            </CustomText>
          )}

          <View style={styles.count_contain}>
            <CustomText bold={true} style={styles.price}>
              Rs:{data?.totalAmount}
            </CustomText>
          </View>
        </View>
        <View>
          <CustomText bold={false} style={styles.cardText_date}>
            {formattedDate}
          </CustomText>
          <CustomText bold={false} style={styles.cardText_date}>
            {formattedTime}
          </CustomText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CartCard: {
    width: "100%",
    backgroundColor: "#C43E1A42",
    borderRadius: 10,
    marginBottom: 10,
  },

  cart_image: {
    width: 120,
    height: 80,
  },

  cart_inner_contain: {
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card_text: {
    fontSize: 14,
    color: "#000000",
  },
  cardText_date: {
    fontSize: 14,
    color: "#000000",
    width: 120,
  },
  text_content: {
    paddingLeft: 10,
  },
  para: {
    fontSize: 10,
    color: "green",
  },
  para1: {
    fontSize: 10,
    color: "red",
  },

  price: {
    fontSize: 15,
    color: "#B22310",
    paddingRight: 5,
  },

  count_contain: {
    flexDirection: "row",
  },
});

export default CompletedOrders;
