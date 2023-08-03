import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import Card_Image from "../assets/Card_Image.png";
import CustomText from "./CustomText";
import Grade from "../assets/grade.png";
import visibility from "../assets/visibility.png";
import { EyeImage } from "./SVGs";
import { useNavigation } from "@react-navigation/native";

function Card({ data }) {
  const navigation = useNavigation();

  const navigateProduct = () => {
    navigation.navigate("ViewProduct");
  };

  return (
    <View style={styles.card_Main}>
      <View style={styles.grade_tag}>
        <Image source={Card_Image} style={styles.card_Iamge} />
        <View style={styles.grade}>
          <Text style={styles.grade_text} bold={false}>
            4.5
          </Text>
          <Image source={Grade} style={styles.star_image} />
        </View>
      </View>
      <View style={styles.product_name}>
        {/* <CustomText style={styles.card_title} bold={true}>
          {data?.Name}
        </CustomText> */}
        <Text style={styles.card_title}>{data?.Name}</Text>
        <View style={styles.price_contains}>
          <Text style={styles.price} bold={false}>
            Price
          </Text>
          <Text style={styles.price} bold={false}>
            Rs: {data?.SalePrice}/{data?.ProductType === "Piece" ? "Pcs" : "kg"}
          </Text>
        </View>
        <View style={styles.cart_section}>
          <TouchableOpacity style={styles.button}>
            {/* <CustomText style={styles.buttonText} bold={false}>
              Add To Cart
            </CustomText> */}
            <Text style={styles.buttonText}> Add To Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.eyeButton} onPress={navigateProduct}>
            <EyeImage />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 95,
    height: 30,
    backgroundColor: "#C43E1A",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  eyeButton: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#C43E1A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 12,
    color: "#FFFFFF",
  },

  cart_section: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  card_Main: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },

  card_Iamge: {
    width: "100%",
    borderRadius: 5,
    height: 120,
  },

  grade_tag: {},

  grade: {
    width: 35,
    height: 20,
    backgroundColor: "#B22310",
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 2,
    position: "absolute",
    top: 100,
  },

  grade_text: {
    fontSize: 10,
    color: "#FFFFFF",
  },

  star_image: {
    width: 10,
    height: 10,
  },
  card_title: {
    fontSize: 14,
    color: "#C43E1A",
  },

  product_name: {
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 12,
  },

  price_contains: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
});

export default Card;
