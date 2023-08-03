import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../Helpers/CustomText";
import { useNavigation } from "@react-navigation/native";

import Button from "../Helpers/Buttons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import Header from "../Helpers/Header";
import PlaceHolder from "../assets/PlaceHolder.png";
import { Camera } from "../Helpers/SVGs";

function EditProfile() {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
    fullName: useRef(null),
    confirmPassword: useRef(null),
    location: useRef(null),
    phoneNumber: useRef(null),
    gender: useRef(null),
  };

  const scrollToField = (refName) => {
    const ref = inputRefs[refName]?.current;
    if (ref) {
      ref.focus();
      scrollViewRef.current?.scrollToPosition(0, ref.offsetTop - 100);
    }
  };
  const [image, setImage] = useState(null);

  // Function to handle image upload
  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    let pickerResult;
    if (Platform.OS === "web") {
      pickerResult = await ImagePicker.launchImageLibraryAsync();
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    location: "",
    phoneNumber: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    location: "",
    phoneNumber: "",
    gender: "",
  });

  const handleInputChange = (field, value) => {
    console.log(field, value);
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const handleSubmit = () => {
    const {
      email,
      password,
      fullName,
      confirmPassword,
      location,
      phoneNumbers,
      gender,
    } = credentials;

    if (validateInputs()) {
      if (email === "example@example.com" && password === "password") {
        Alert.alert("Login Successful");
      } else {
        Alert.alert("Invalid credentials");
      }
    }
  };

  const validateInputs = () => {
    const {
      email,
      password,
      fullName,
      confirmPassword,
      location,
      phoneNumber,
      gender,
    } = credentials;
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Name is required",
      }));
      isValid = false;
      scrollToField("fullName");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "", // Clear the email error message
      }));
    }

    // Validate email
    if (!email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;

      // Scroll to the email input field
      scrollToField("email");
    } else if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;

      // Scroll to the email input field
      scrollToField("email");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "", // Clear the email error message
      }));
    }

    // Validate password
    if (!password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
      scrollToField("password");
      // Scroll to the password input field
    } else if (password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password should be at least 6 characters",
      }));
      isValid = false;
      scrollToField("password");
      // Scroll to the password input field
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "", // Clear the password error message
      }));
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm password is required",
      }));
      scrollToField("confirmPassword");
      return;
    } else if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match", // Clear the confirm password error message
      }));
      scrollToField("confirmPassword");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "", // Clear the password error message
      }));
    }

    if (!location.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "Location is required",
      }));
      isValid = false;
      scrollToField("location");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "", // Clear the email error message
      }));
    }

    if (!phoneNumber.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number is required",
      }));
      scrollToField("phoneNumber");
      return;
    } else if (phoneNumber.trim().length !== 11) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number should be 11 digits",
      }));
      scrollToField("phoneNumber");
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "", // Clear the phone number error message
      }));
    }

    return isValid;
  };

  const redirect = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../assets/backgroundImage.png")}
      >
        <Header text={"Edit Profile"} isBack={true} navigateUrl={"Profile"} />
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={100}
        >
          <View style={styles.inputContainer}>
            {image ? (
              <View style={styles.imageContains}>
                <Image source={{ uri: image }} style={styles.previewImage} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
              >
                <View style={styles.imageContains}>
                  <View style={styles.camere_contain}>
                    <Image source={PlaceHolder} style={styles.previewImage} />
                    <View style={styles.camera}>
                      <Camera />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Full Name
            </CustomText>
            <TextInput
              ref={inputRefs.fullName}
              style={[styles.input, !!errors.fullName && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("fullName", text)}
              value={credentials.fullName}
              placeholder="Enter name"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!errors.fullName && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.fullName}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Email
            </CustomText>
            <TextInput
              ref={inputRefs.email}
              style={[styles.input, !!errors.email && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("email", text)}
              value={credentials.email}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!errors.email && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.email}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Location
            </CustomText>
            <TextInput
              ref={inputRefs.location}
              style={[styles.input, !!errors.location && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("location", text)}
              value={credentials.location}
              placeholder="Enter location"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!errors.location && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.location}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Phone Number
            </CustomText>
            <TextInput
              ref={inputRefs.phoneNumber}
              style={[styles.input, !!errors.phoneNumber && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              value={credentials.phoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={11} // Limit the number of characters to 11
            />
            {!!errors.phoneNumber && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.phoneNumber}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Gender
            </CustomText>
            <View style={styles.picker_input}>
              <Picker
                ref={inputRefs.gender}
                selectedValue={credentials.gender}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                onValueChange={(itemValue, itemIndex) =>
                  handleInputChange("gender", itemValue)
                }
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {!!errors.gender && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.gender}
              </CustomText>
            )}
          </View>

          <View style={styles.signUpButton}>
            <Button
              onPressOk={handleSubmit}
              title="Save"
              isButtonFirst={true}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    justifyContent: "flex-start",
  },

  camera: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  container: {
    flex: 1,
  },
  signUpButton: {
    paddingTop: 50,
  },
  mainText: {
    fontSize: 33,
  },
  inputContainer: {
    paddingTop: 30,
  },
  inputText: {
    fontSize: 10,
    color: "#393939",
  },
  input: {
    height: 50,
    borderColor: "#B6B6B6",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 8,
  },
  inputError: {
    borderColor: "red",
  },
  pickerItem: {
    fontSize: 16, // Customize the font size
    color: "#000", // Customize the text color
    height: 100, // Customize the item height
  },

  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    color: "#C43E1A",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 150,
    height: 150,
    marginTop: 0,
    resizeMode: "cover",
    borderRadius: 100,
  },

  imageContains: {
    alignItems: "center",
    position: "relative",
    width: "100%",
  },

  postiveImage: {
    top: 4,
    right: 5,
  },

  picker_input: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#B6B6B6",
  },

  camere_contain: {
    width: "40%",
  },
});

export default EditProfile;
