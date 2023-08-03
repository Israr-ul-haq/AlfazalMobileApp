import React, { useState } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import BoilingGif from "../assets/boiling.gif";
import Rider from "../assets/Rider.gif";
import Button from "../Helpers/Buttons";
import { Rating } from "react-native-ratings";
import ViewOrder from "../Helpers/ViewOrder";

function OrderScreen() {
  const [isRider, setIsRider] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Order"} isBack={true} navigateUrl={"Home"} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.container}>
          <ViewOrder />
          <Button onPressOk={openModal} title="Rate Us" isButtonFirst={true} />
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={styles.modal_backGround}>
            <CustomText bold={true} style={styles.pb30}>
              Ratings & Reviews
            </CustomText>
            <Rating
              startingValue={0}
              imageSize={35} // Decreases the size of stars
              ratingBackgroundColor="lightgray" // Changes the color of empty stars
              showRating={false} // Removes the text from the rating component
              style={styles.pb25}
            />
            <View style={styles.view_width}></View>
            <CustomText bold={true} style={styles.font__size}>
              Description
            </CustomText>
            <TextInput
              style={styles.input} // Apply error styles if there is an error
              placeholder="Enter Description"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#707070"
            />
            <View style={styles.view_width}>
              <Button
                onPressOk={closeModal}
                title="Submit"
                isButtonFirst={true}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C43E1A",
    borderRadius: 5,
    textAlignVertical: "top",
    paddingLeft: 10,
    paddingTop: 10,
    width: "100%",
    marginTop: 10,
    marginBottom: 50,
  },

  scrollView: {
    flexGrow: 1,
  },

  scrollView: {
    flexGrow: 1,
  },

  main_heading: {
    fontSize: 14,
    color: "#57585B",
  },
  container: {
    paddingHorizontal: 20,
  },

  timeHeading: {
    color: "#B22310",
    fontSize: 14,
  },

  text_contains: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 30,
  },
  gif_contains: {
    alignItems: "center",
    marginTop: 20,
  },
  div_width: {
    width: 120,
  },

  gif_tag: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 30,
  },

  font_size: {
    fontSize: 14,
  },

  border_line: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C43E1A",
    marginBottom: 32,
  },

  font_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  font_contains_total: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 50,
  },

  /////MOdal styling start
  modal_backGround: {
    backgroundColor: "white",
    padding: 25,
    width: 320,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },

  pb30: {
    paddingBottom: 30,
  },
  pb25: {
    paddingBottom: 25,
  },

  font__size: {
    fontSize: 14,
    alignItems: "flex-start",
    width: "100%",
  },

  view_width: {
    width: "100%",
  },
});

export default OrderScreen;
