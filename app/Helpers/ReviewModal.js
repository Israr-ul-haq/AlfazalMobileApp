import React, { useState } from "react";
import { Modal, View } from "react-native";
import CustomText from "./CustomText";
import { AirbnbRating, Rating } from "react-native-ratings";
import { TextInput } from "react-native";
import Button from "./Buttons";
import { StyleSheet } from "react-native";
import { submitReview } from "../Services/OrderService";

function ReviewModal({
  closeModal,
  isModalVisible,
  user,
  updateUserAndStorage,
  setUser,
}) {
  const [credentials, setCredentials] = useState({
    review: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({
    rating: 0,
  });

  const [loader, setLoader] = useState(false);

  const validateInputs = () => {
    const { rating } = credentials;
    let isValid = true;

    if (rating === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        rating: "rating is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        rating: "", // Clear the name error message
      }));
    }

    return isValid;
  };

  const reviewSubmit = async () => {
    try {
      if (validateInputs()) {
        setLoader(true);
        const finalData = {
          userId: user._id,
          review: credentials.review,
          rating: credentials.rating,
          orderId: user.latestOrderId,
        };
        const response = await submitReview(finalData);
        console.log(response);
        if (response.status === 200) {
          setUser((prevUser) => {
            const updatedUser = {
              ...prevUser,
              orderReviewStatus: false,
              latestOrderId: "",
            };
            updateUserAndStorage(updatedUser); // Call the async function
            return updatedUser;
          });
          closeModal();
          setLoader(false);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            message: response.message, // Clear the name error message
          }));
          setLoader(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const handleRating = (ratingValue) => {
    console.log(ratingValue);
    setCredentials({ ...credentials, rating: ratingValue });
  };

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  return (
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
          <View style={styles.pb25}>
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={35}
              showRating={false}
              onFinishRating={handleRating}
            />
          </View>
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
            onChangeText={(text) => handleInputChange("review", text)}
          />
          <View style={styles.view_width}>
            {!!errors.rating && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.rating}
              </CustomText>
            )}
            {!!errors.message && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.message}
              </CustomText>
            )}
            <Button
              onPressOk={reviewSubmit}
              title="Submit"
              isButtonFirst={true}
              isLoading={loader}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

  main_heading: {
    fontSize: 14,
    color: "#57585B",
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

  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 8,
    textAlign: "center",
  },
});

export default ReviewModal;
