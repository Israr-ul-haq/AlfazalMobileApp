import React, { useContext, useEffect, useState } from "react";
import Header from "../Helpers/Header";
import { ImageBackground, StyleSheet, View, ScrollView } from "react-native";
import CartCard from "../Helpers/CartCard";
import SubTotalCard from "../Helpers/SubTotalCard";
import { getCartItems } from "../Services/CartService";
import AppContext from "../Helpers/UseContextStorage";
import { useFocusEffect } from "@react-navigation/native";
import CartSkeletonPlaceholder from "../Helpers/CartSekeletonPlaceHolder";

function Cart() {
  const { user, cartData, setCartData, setCartCount } = useContext(AppContext);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    // Calculate and set the grand total whenever cartData changes
    const total = cartData.reduce(
      (accumulator, item) => accumulator + item.item.SalePrice * item.count,
      0
    );
    setGrandTotal(total);
  }, [cartData]);

  const getData = async () => {
    try {
      setLoader(true);
      const response = await getCartItems(user._id);
      const newData = response.data.cartItems;
      setCartData(newData);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Cart"} isBack={false} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.pb150}>
          <View style={styles.cartContains}>
            {loader ? (
              <CartSkeletonPlaceholder />
            ) : (
              cartData?.map((i, index) => {
                return (
                  <CartCard
                    data={i}
                    key={`cart_${index}`}
                    setCartData={setCartData}
                    cartData={cartData}
                    userId={user._id}
                    setCartCount={setCartCount}
                  />
                );
              })
            )}
          </View>
          <SubTotalCard pageNavigate={"Payment"} grandTotal={grandTotal} />
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
