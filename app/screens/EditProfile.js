import React, { useRef, useState, useContext } from "react";
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
import AppContext from "../Helpers/UseContextStorage";
import { baseURL } from "../Constants/axios.config";
import { deleteImage, update, upload } from "../Services/AuthService";
import AsyncService from "../Services/AsyncStorage";

function EditProfile() {
  const { user, setUser } = useContext(AppContext);

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const [file, setFile] = useState("");
  const [imageUrl, setImageUrl] = useState(baseURL + user?.img);

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
      const selectedImage = pickerResult.assets[0]; // @ts-ignore
      setFile(selectedImage.uri);
      setImageUrl(selectedImage.uri);
    }
  };

  const inputRefs = {
    email: useRef(null),

    name: useRef(null),

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

  const [credentials, setCredentials] = useState({
    email: user?.email,
    name: user?.name,
    address: user?.address,
    phoneNumber: user?.phoneNumber,
    gender: user?.gender,
    img: "",
    lat: "",
    lng: "",
    updatedBy: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    message: "",
    name: "",

    address: "",
    phoneNumber: "",
    gender: "",
  });

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const validateInputs = () => {
    const { name, address, phoneNumber } = credentials;
    let isValid = true;

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
    } else if (!phoneNumber.trim().startsWith("+92")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number should start with +92",
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

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoader(true);
      if (file !== "") {
        const fmData = new FormData();
        fmData.append("image", {
          uri: file,
          type: "image/jpeg", // Modify the type accordingly if the image is in a different format
          name: "image.jpg", // Modify the name accordingly
        });

        try {
          const res = await upload(fmData); // Replace "upload" with your API call to upload the image
          if (res && res.status === 200) {
            console.log("updateImage");
            setImageUrl(res.data.url);
            credentials.img = res.data.url;
            const resDelete = await deleteImage({
              img: user?.img,
            });
          } else {
            console.log("Error uploading image.", res);
          }
        } catch (err) {
          console.log("Error: ", err);
        }
      } else {
        credentials.img = user?.img;
      }

      credentials.lat = "5632362625";
      credentials.lng = "541655415";
      credentials.updatedBy = user?._id;

      const res = await update(user._id, credentials);
      // console.log(res, "response");
      if (res.status === 200) {
        // console.log(res);

        console.log("data updated");
        await AsyncService.updateUser({
          name: credentials.name,
          address: credentials.address,
          phoneNumber: credentials.phoneNumber,
          gender: credentials.gender,
          img: credentials.img,
        });

        const updatedUser = {
          ...user, // Keep existing user data
          name: credentials.name,
          address: credentials.address,
          phoneNumber: credentials.phoneNumber,
          gender: credentials.gender,
          email: credentials.email,
          img: credentials.img,
        };
        setUser(updatedUser);
        setLoader(false);
        navigation.navigate("Profile");
      }
    }
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
            {imageUrl && (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
              >
                <View style={styles.imageContains}>
                  <View style={styles.camere_contain}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.previewImage}
                    />
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
              editable={false}
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
              ref={inputRefs.address}
              style={[styles.input, !!errors.address && styles.inputError]} // Apply error styles if there is an error
              onChangeText={(text) => handleInputChange("address", text)}
              value={credentials.address}
              placeholder="Enter location"
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

  resErrortext: {
    color: "red",
    marginBottom: 8,
    fontSize: 10,
    textAlign: "center",
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
    paddingBottom: 110,
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
