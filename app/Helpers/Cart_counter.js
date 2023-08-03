import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Postive_Image } from "./SVGs";
import CustomText from "./CustomText";

function CartCounter() {
  const [count, setCount] = useState(1);

  const incrementCounter = () => {
    setCount(count + 1);
  };

  const decrementCounter = () => {
    if (count > 1) {
      setCount(count - 1);
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
        {count}
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
