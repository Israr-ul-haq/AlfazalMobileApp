import React, { useRef, useState } from "react";
import { View } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import CustomText from "../Helpers/CustomText";
import { TextInput } from "react-native";
import Button from "../Helpers/Buttons";
import { ResetPassword, forgotPassword } from "../Services/AuthService";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function ForgotPassword() {
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({
    phoneNumber: "+92",
    newPassword: "",
    confirmPassword: "",
  });
  const scrollViewRef = useRef(null);
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);
  const [loader, setLoader] = useState(false);
  const [isOtpInput, setIsOtpInputs] = useState(false);
  const [isPhoneInput, setIsphoneInputs] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    message: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  const handleInputChange = (field, value) => {
    if (field === "phoneNumber") {
      if (value.trim() === "") {
        value = "+92";
      }
    }
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const validateInputs = () => {
    const { phoneNumber } = credentials;

    let isValid = true;

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number is required",
      }));
      isValid = false;
    } else if (phoneNumber.trim().length !== 13) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number should be 12 digits",
      }));

      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "", // Clear the phone number error message
      }));
    }

    return isValid;
  };

  // Function to handle OTP input change
  const handleOTPChange = (value, index) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);

    // Move focus to the next input
    if (index < 5 && value !== "") {
      refs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    const updatedOTP = [...otp];
    if (index > 0) {
      updatedOTP[index - 1] = "";
      setOTP(updatedOTP);
      refs.current[index - 1].focus();
    } else {
      updatedOTP[0] = "";
      setOTP(updatedOTP);
    }
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoader(true);

      const finalData = {
        phoneNumber: credentials.phoneNumber,
      };

      const response = await forgotPassword(finalData);

      if (response.status === 200) {
        setLoader(false);
        setIsphoneInputs(false);
        setIsOtpInputs(true);
        // navigation.navigate("Main");
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

  const validateInputsData = () => {
    const { newPassword, confirmPassword } = credentials;
    const combinedOTP = otp.join(""); // Combine the OTP digits into a single string
    console.log(combinedOTP); // The OTP as a single string
    let isValid = true;
    if (!combinedOTP || !combinedOTP.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otp: "OTP is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otp: "", // Clear the password error message
      }));
    }

    // Validate password
    if (!newPassword || !newPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: "Password is required",
      }));
      isValid = false;
    } else if (newPassword.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: "Password should be at least 6 characters",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: "", // Clear the password error message
      }));
    }

    // Validate confirm password
    if (!confirmPassword || !confirmPassword.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm password is required",
      }));
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match", // Clear the confirm password error message
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "", // Clear the password error message
      }));
    }

    return isValid;
  };

  const handleSubmitNewData = async () => {
    if (validateInputsData()) {
      setLoader(true);

      const combinedOTP = otp.join("");
      const finalData = {
        phoneNumber: credentials.phoneNumber,
        newPassword: credentials.newPassword,
        otp: combinedOTP,
      };
      const response = await ResetPassword(finalData);

      if (response.status === 200) {
        setLoader(false);
        setIsphoneInputs(false);
        setIsOtpInputs(true);
        navigation.navigate("Login");
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
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        extraScrollHeight={100}
      >
        <View style={styles.mainTextConatiner}>
          <View style={styles.logoContains}>
            <Image style={styles.logo} source={require("../assets/logo.png")} />
          </View>

          {isOtpInput && (
            <View style={styles.inputContainer}>
              <CustomText style={styles.inputText} bold={false}>
                Enter OTP
              </CustomText>
              <View style={styles.otpContainer}>
                {Array.from({ length: 6 }, (_, index) => (
                  <TextInput
                    key={index}
                    ref={(input) => (refs.current[index] = input)}
                    style={styles.otpInput}
                    placeholder=""
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace") {
                        handleBackspace(index);
                      }
                    }}
                  />
                ))}
              </View>
              {!!errors.otp && (
                <CustomText style={styles.errorText} bold={false}>
                  {errors.otp}
                </CustomText>
              )}
              <View style={styles.inputContainer}>
                <View style={styles.inputPassContain}>
                  <CustomText style={styles.inputText} bold={false}>
                    New Password
                  </CustomText>
                  <View style={styles.postion__relative}>
                    <TextInput
                      style={[
                        styles.input,
                        !!errors.newPassword && styles.inputError,
                      ]} // Apply error styles if there is an error
                      onChangeText={(text) =>
                        handleInputChange("newPassword", text)
                      }
                      value={credentials.newPassword}
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
                  {!!errors.newPassword && (
                    <CustomText style={styles.errorText} bold={false}>
                      {errors.newPassword}
                    </CustomText>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <CustomText style={styles.inputText} bold={false}>
                    Confirm Password
                  </CustomText>
                  <View style={styles.postion__relative}>
                    <TextInput
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
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
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
              </View>
              <View style={styles.signUpButton}>
                {!!errors.message && (
                  <CustomText style={styles.resErrortext} bold={false}>
                    {errors.message}
                  </CustomText>
                )}
                <Button
                  onPressOk={handleSubmitNewData}
                  title="Submit"
                  isButtonFirst={true}
                  isLoading={loader}
                />
              </View>
            </View>
          )}

          {isPhoneInput && (
            <View style={styles.inputContainer}>
              <CustomText style={styles.inputText} bold={false}>
                Phone Number
              </CustomText>
              <TextInput
                style={[
                  styles.input,
                  !!errors.phoneNumber && styles.inputError,
                ]} // Apply error styles if there is an error
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                value={credentials.phoneNumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={13}
              />
              {!!errors.phoneNumber && (
                <CustomText style={styles.errorText} bold={false}>
                  {errors.phoneNumber}
                </CustomText>
              )}

              <View style={styles.signUpButton}>
                {!!errors.message && (
                  <CustomText style={styles.resErrortext} bold={false}>
                    {errors.message}
                  </CustomText>
                )}
                <Button
                  onPressOk={handleSubmit}
                  title="Submit"
                  isButtonFirst={true}
                  isLoading={loader}
                />
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
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

  logo: {
    width: 200,
    height: 200,
    objectFit: "contain",
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    paddingTop: 30,
  },
  inputText: {
    fontSize: 10,
    color: "#393939",
  },

  logoContains: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  input: {
    height: 50,
    borderColor: "#B6B6B6",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    width: 35,
    textAlign: "center",
  },

  inputError: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 8,
  },

  resErrortext: {
    color: "red",
    marginBottom: 8,
    fontSize: 10,
    textAlign: "center",
  },

  mainTextConatiner: {
    flexGrow: 1,

    paddingVertical: 40,
    width: "100%",
  },

  signUpButton: {
    marginTop: 30,
  },
});

export default ForgotPassword;
