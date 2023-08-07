import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Postive_Image } from "./SVGs";
import CustomText from "./CustomText";
import { updateCart } from "../Services/CartService";

function CartCounter({ data, cartData, setCartData }) {
  const incrementCounter = async () => {
    try {
      const newCount = data.count + 1;

      if (newCount > 0) {
        setCartData((prev) => {
          const updatedData = prev.map((cartItem) =>
            cartItem._id === data._id
              ? { ...cartItem, count: newCount }
              : cartItem
          );
          return updatedData;
        });
        // Make a network request to the API to update the count on the server
        const response = await updateCart(data._id, {
          count: newCount,
        });

        if (response.status === 200) {
          // If the API call is successful, update the count in the local state
        } else {
          console.log("Failed to update count on the server");
        }
      }
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };
  const decrementCounter = async () => {
    try {
      const newCount = data.count - 1;
      if (newCount > 0) {
        setCartData((prev) => {
          const updatedData = prev.map((cartItem) =>
            cartItem._id === data._id
              ? { ...cartItem, count: newCount }
              : cartItem
          );
          return updatedData;
        });
        // Make a network request to the API to update the count on the server
        const response = await updateCart(data._id, {
          count: newCount,
        });

        if (response.status === 200) {
          // If the API call is successful, update the count in the local state
        } else {
          console.log("Failed to update count on the server");
        }
      }
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  return (
    <View style={styles.counter_contains}>
      <TouchableOpacity
        style={styles.negative_contains}
        onPress={decrementCounter}
      >
        <View style={styles.negative_mark}></View>
      </TouchableOpacity>
      <CustomText style={styles.number} bold={true}>
        {data?.count}
      </CustomText>
      <TouchableOpacity
        style={styles.positive_button}
        onPress={incrementCounter}
      >
        <Postive_Image />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  counter_contains: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderColor: "#C43E1A",
    borderRadius: 5,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },

  negative_contains: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  negative_mark: {
    borderWidth: 1,
    width: 20,
    borderColor: "#C43E1A",
  },
  number: {
    color: "#C43E1A",
    fontSize: 16,
  },

  positive_button: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#C43E1A",
    backgroundColor: "#C43E1A",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CartCounter;
