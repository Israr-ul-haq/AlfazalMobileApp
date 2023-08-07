import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { deleteImage, rejisterUser, upload } from "../Services/AuthService";
import { Ionicons } from "@expo/vector-icons";

function SignUp() {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
    name: useRef(null),
    confirmPassword: useRef(null),
    address: useRef(null),
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
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Make sure the options are defined correctly
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!pickerResult.cancelled) {
      setFile(pickerResult.uri);

      const fmData = new FormData();
      fmData.append("image", {
        uri: pickerResult.uri,
        type: "image/jpeg", // Modify the type accordingly if the image is in a different format
        name: "image.jpg", // Modify the name accordingly
      });

      try {
        const res = await upload(fmData); // Replace "upload" with your API call to upload the image
        if (res && res.status === 200) {
          setImageUrl(res.data.url);
          if (imageUrl !== "") {
            const res = await deleteImage({
              img: imageUrl,
            });
            console.log(res);
          }
        } else {
          console.log("Error uploading image.", res);
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "+92",
    gender: "Male",
    lat: "122565",
    lng: "63255656",
    role: "user",
    img: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    gender: "",
    img: "",
    message: "",
  });

  const validateInputs = () => {
    const { email, password, name, confirmPassword, address, phoneNumber } =
      credentials;
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name
    if (!name || !name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      isValid = false;
      scrollToField("name");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "", // Clear the name error message
      }));
    }

    // Validate email
    if (!email || !email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
      scrollToField("email");
    } else if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
      scrollToField("email");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "", // Clear the email error message
      }));
    }

    // Validate password
    if (!password || !password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
      scrollToField("password");
    } else if (password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password should be at least 6 characters",
      }));
      isValid = false;
      scrollToField("password");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "", // Clear the password error message
      }));
    }

    // Validate confirm password
    if (!confirmPassword || !confirmPassword.trim()) {
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

    // Validate address
    if (!address || !address.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "Address is required",
      }));
      isValid = false;
      scrollToField("address");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "", // Clear the address error message
      }));
    }

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number is required",
      }));
      scrollToField("phoneNumber");
      return;
    } else if (phoneNumber.trim().length !== 13) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number should be 12 digits",
      }));
      scrollToField("phoneNumber");
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "", // Clear the phone number error message
      }));
    }

    // Validate image
    if (!file || !file.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        img: "Image is required",
      }));
      isValid = false;
      scrollToField("img");
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        img: "", // Clear the image error message
      }));
    }

    return isValid;
  };

  const handleInputChange = (field, value) => {
    if (field === "phoneNumber") {
      if (value.trim() === "") {
        value = "+92";
      }
    }
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoader(true);
      delete credentials?.confirmPassword;

      credentials.img = imageUrl;

      const response = await rejisterUser(credentials);

      if (response.status === 200) {
        setLoader(false);
        navigation.navigate("Main");
      } else {
        setLoader(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          message: response.data.message, // Clear the name error message
        }));
        return;
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../assets/backgroundImage.png")}
      >
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={100}
        >
          <CustomText style={styles.mainText} bold={true}>
            SignUp
          </CustomText>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Full Name
            </CustomText>
            <TextInput
              ref={inputRefs.name}
              style={[styles.input, !!errors.name && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("name", text)}
              value={credentials.name}
              placeholder="Enter name"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!errors.name && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.name}
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
              Password
            </CustomText>
            <View style={styles.postion__relative}>
              <TextInput
                ref={inputRefs.password}
                style={[styles.input, !!errors.password && styles.inputError]} // Apply error styles if there is an error
                onChangeText={(text) => handleInputChange("password", text)}
                value={credentials.password}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
            {!!errors.password && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.password}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Confirm Password
            </CustomText>
            <View style={styles.postion__relative}>
              <TextInput
                ref={inputRefs.confirmPassword}
                style={[
                  styles.input,
                  !!errors.confirmPassword && styles.inputError,
                ]} // Apply error styles if there is an error
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
                value={credentials.confirmPassword}
                placeholder="Enter password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
            {!!errors.confirmPassword && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.confirmPassword}
              </CustomText>
            )}
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.inputText} bold={false}>
              Address
            </CustomText>
            <TextInput
              ref={inputRefs.address}
              style={[styles.input, !!errors.address && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("address", text)}
              value={credentials.address}
              placeholder="Enter home address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!!errors.address && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.address}
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
              maxLength={13} // Limit the number of characters to 11
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
          <View style={styles.inputContainer}>
            {file && (
              <View style={styles.imageContains}>
                <Image source={{ uri: file }} style={styles.previewImage} />
              </View>
            )}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}
            >
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.postiveImage}
                  source={require("../assets/add.png")}
                  resizeMode="contain"
                />
                <CustomText style={styles.uploadButtonText} bold={false}>
                  Tap to upload a Image
                </CustomText>
              </View>
            </TouchableOpacity>
            {!!errors.img && (
              <CustomText style={styles.errorText} bold={false}>
                {errors.img}
              </CustomText>
            )}
          </View>

          <View style={styles.signUpButton}>
            {!!errors.message && (
              <CustomText style={styles.resErrortext} bold={false}>
                {errors.message}
              </CustomText>
            )}
            <Button
              onPressOk={handleSubmit}
              title="Update"
              isButtonFirst={true}
              isLoading={loader}
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
    paddingVertical: 40,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 8,
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    bottom: 0,
  },

  postion__relative: {
    position: "relative",
  },

  resErrortext: {
    color: "red",
    marginBottom: 8,
    fontSize: 10,
    textAlign: "center",
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
    borderWidth: 1,
    borderColor: "#C43E1A",
  },

  imageContains: {
    alignItems: "center",
  },
  uploadButton: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 50,
    alignSelf: "center",
    borderColor: "#C43E1A",
    borderWidth: 1,
  },
  postiveImage: {
    top: 4,
    right: 5,
  },
  iconWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  picker_input: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#B6B6B6",
  },
});

export default SignUp;
