import React from "react";
import { View, StyleSheet, Image } from "react-native";
import cartImage from "../assets/cartImage.png";
import CustomText from "./CustomText";
import CartCounter from "./Cart_counter";

function CartCard({ data, key }) {
  return (
    <View style={styles.CartCard} key={key}>
      <View style={styles.cart_inner_contain}>
        <Image
          source={cartImage}
          style={styles.cart_image}
          resizeMode={"contain"}
        />
        <View style={styles.text_content}>
          <CustomText bold={false} style={styles.card_text}>
            {data?.name}
          </CustomText>
          <CustomText bold={false} style={styles.para}>
            {data?.description}
          </CustomText>
          <View style={styles.count_contain}>
            <CustomText bold={true} style={styles.price}>
              Rs:{data?.price}
            </CustomText>
            <CartCounter />
          </View>
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
  },

  cart_inner_contain: {
    padding: 6,
    flexDirection: "row",
  },
  card_text: {
    fontSize: 14,
    color: "#000000",
  },
  text_content: {
    paddingLeft: 10,
  },
  para: {
    fontSize: 10,
    color: "#707070",
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

export default CartCard;
