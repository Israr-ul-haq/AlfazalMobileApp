import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import Card_Image from "../assets/Card_Image.png";
import CustomText from "./CustomText";
import Grade from "../assets/grade.png";
import visibility from "../assets/visibility.png";
import { EyeImage } from "./SVGs";
import { useNavigation } from "@react-navigation/native";
import { AddCart } from "../Services/CartService";
import AppContext from "./UseContextStorage";

function Card({ data, setData }) {
  const navigation = useNavigation();
  const { user, setCartCount } = useContext(AppContext);
  const navigateProduct = () => {
    navigation.navigate("ViewProduct", { data: data }); // Pass the productId as a parameter
  };

  const addTocart = async (status) => {
    const newStatus = !status; // Toggle the cart status
    const newCount = newStatus ? 1 : 0; // Set count based on the status

    if (newStatus) {
      setCartCount((prevCartCount) => prevCartCount + 1);
    } else {
      setCartCount((prevCartCount) => prevCartCount - 1);
    }

    setData((prevData) => {
      const updatedData = prevData.map((item) => {
        if (item._id === data?._id) {
          return {
            ...item,
            isCartAdded: newStatus,
            count: newCount,
          };
        }
        return item;
      });

      return updatedData;
    });

    const payload = {
      userId: user._id,
      itemId: data?._id,
      count: 1,
    };

    try {
      const res = await AddCart(payload); // Replace "upload" with your API call to upload the image
      if (res && res.status === 200) {
      } else {
        console.log("Error", res);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  return (
    <View style={styles.card_Main}>
      <View style={styles.grade_tag}>
        <Image
          source={data?.img ? data.img : Card_Image}
          style={styles.card_Iamge}
        />
        {data?.count !== 0 && (
          <View style={styles.count_contains}>
            <Text style={styles.counttext} bold={false}>
              {data?.count}
            </Text>
          </View>
        )}

        <View style={styles.grade}>
          <Text style={styles.grade_text} bold={false}>
            4.5
          </Text>
          <Image source={Grade} style={styles.star_image} />
        </View>
      </View>
      <View style={styles.product_name}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => addTocart(data?.isCartAdded)}
          >
            <Text style={styles.buttonText}>
              {data?.isCartAdded ? "Remove" : "Add To Cart"}
            </Text>
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

  counttext: {
    color: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
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

  grade_tag: {
    position: "relative",
  },

  count_contains: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#B22310",
    position: "absolute",
    right: -5,
    top: -10,
    zIndex: 1000,
  },

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
