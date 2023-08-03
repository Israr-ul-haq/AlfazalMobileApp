import React, { useState } from "react";
import { View } from "react-native";
import Header from "../Helpers/Header";
import {
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import ProductImage from "../assets/food.jpg";
import CustomText from "../Helpers/CustomText";
import { Rating } from "react-native-ratings";
import Button from "../Helpers/Buttons";
import Counter from "../Helpers/Counter";

function ViewProduct() {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <Header text="Product Details" isBack={true} navigateUrl={"Home"} />

        <View style={styles.contains}>
          <Image
            source={ProductImage}
            style={styles.product_Image}
            resizeMode="cover"
          />
          <ImageBackground
            style={styles.productDetails_contains}
            source={require("../assets/backgroundImage.png")}
          >
            <View style={styles.product_details_contains}>
              <CustomText bold={true} style={styles.product_title}>
                Mix Cake slices
              </CustomText>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.details_page}>
          <View style={styles.flex_contains}>
            <View>
              <CustomText style={styles.product_weight} bold={false}>
                Rs: 1259/kg
              </CustomText>
              <Rating
                readonly // Disables the rating change
                startingValue={3}
                imageSize={12} // Decreases the size of stars
                ratingBackgroundColor="lightgray" // Changes the color of empty stars
                showRating={false} // Removes the text from the rating component
                style={styles.rating_star}
              />
            </View>

            <Counter />
          </View>
          <View style={styles.description_contains}>
            <CustomText bold={false}>Description</CustomText>
            <CustomText style={styles.para}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.{" "}
            </CustomText>
          </View>
          <View style={styles.description_contains}>
            <CustomText bold={false}>Instructions</CustomText>
            <TextInput
              style={styles.input} // Apply error styles if there is an error
              placeholder="Enter Instructions"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#707070"
            />
          </View>
          <View style={styles.cart_button}>
            <Button
              // onPressOk={handleLogin}
              title="Add to Cart"
              isButtonFirst={true}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  description_contains: {
    paddingTop: 25,
  },

  background: {
    flex: 1,
    backgroundColor: "white",
  },
  product_Image: {
    margin: 0,
    padding: 0,
    width: 375,
    height: 320,
    bottom: 15,
  },

  productDetails_contains: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 200, // Adjust the border radius to create the desired curve
    borderTopRightRadius: 200,
  },

  product_details_contains: {
    marginHorizontal: 30,
    marginTop: 40,
  },

  details_page: {
    marginHorizontal: 30,
  },

  contains: {
    position: "relative",
  },

  product_weight: {
    color: "#C43E1A",
    fontSize: 16,
  },

  product_title: {
    fontSize: 16,
  },

  rating_star: {
    alignItems: "flex-start",
  },

  flex_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  para: {
    fontSize: 12,
    color: "#707070",
  },

  input: {
    borderWidth: 1,
    borderColor: "#C43E1A",
    borderRadius: 5,
    textAlignVertical: "top",
    paddingLeft: 10,
    paddingTop: 10,
  },

  cart_button: {
    paddingTop: 30,
  },
});

export default ViewProduct;
