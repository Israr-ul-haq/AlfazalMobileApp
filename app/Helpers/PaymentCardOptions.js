import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import EasyPaisa from "../assets/EasyPaisa.png";
import Cash from "../assets/CashOnDelivery.png";
import { JazzCard, VisaCard } from "./SVGs";

function PaymentCardOptions() {
  const [checked, setChecked] = useState("");

  const handlePress = (value) => {
    setChecked(value);
  };

  return (
    <View style={styles.payment__card}>
      {/* <View style={styles.pay_contains}>
        <VisaCard />

        <RadioButton.Item
          label="Card"
          color="red"
          status={checked === "option1" ? "checked" : "unchecked"}
          onPress={() => handlePress("option1")}
          labelStyle={{ marginRight: 20 }}
        />
      </View>
      <View style={styles.pay_contains}>
        <JazzCard />

        <RadioButton.Item
          label="Jazz Cash"
          color="red"
          status={checked === "option2" ? "checked" : "unchecked"}
          onPress={() => handlePress("option2")}
          labelStyle={{ marginRight: 20 }}
        />
      </View>
      <View style={styles.pay_contains}>
        <Image source={EasyPaisa} />
        <RadioButton.Item
          label="Easy Paisa"
          color="red"
          status={checked === "option3" ? "checked" : "unchecked"}
          onPress={() => handlePress("option3")}
          labelStyle={{ marginRight: 20 }}
        />
      </View> */}
      <View style={styles.pay_contains}>
        <Image
          source={Cash}
          style={styles.cashDelivery}
          resizeMode={"contain"}
        />

        {/* <RadioButton.Item
          label="Cash on Delivery"
          color="red"
          status={checked === "option4" ? "checked" : "unchecked"}
          onPress={() => handlePress("option4")}
          labelStyle={{ marginRight: 20 }}
        /> */}

        <RadioButton.Item
          label="Cash on Delivery"
          color="red"
          status={"checked"}
          onPress={() => handlePress("option4")}
          labelStyle={{ marginRight: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pay_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cashDelivery: {
    width: 60,
    height: 50,
  },
  payment__card: {
    marginTop: 15,
    marginBottom: 56,
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  pay_text: {
    fontSize: 16,
  },
});
export default PaymentCardOptions;
