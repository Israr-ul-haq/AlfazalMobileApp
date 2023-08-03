import React, { useState } from "react";
import Header from "../Helpers/Header";
import { ImageBackground, StyleSheet, View, ScrollView } from "react-native";
import CartCard from "../Helpers/CartCard";

import SubTotalCard from "../Helpers/SubTotalCard";

function Cart() {
  const [cartData, setCartData] = useState([
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
  ]);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Cart"} isBack={false} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.pb150}>
          <View style={styles.cartContains}>
            {cartData?.map((i, index) => {
              return <CartCard data={i} key={index} />;
            })}
          </View>
          <SubTotalCard pageNavigate={"Payment"} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },

  background: {
    flex: 1,
    backgroundColor: "white",
  },

  cartContains: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  pt30: {
    paddingTop: 30,
  },

  pt20: {
    paddingTop: 20,
  },

  font14: {
    fontSize: 14,
  },

  pb150: {
    paddingBottom: 150,
  },
});

export default Cart;
