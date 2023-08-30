import React, { useContext, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import CustomText from "../Helpers/CustomText";
import Button from "../Helpers/Buttons";
import { useNavigation } from "@react-navigation/native";
import { update, userLogin } from "../Services/AuthService";
import { Ionicons } from "@expo/vector-icons";
import AsyncService from "../Services/AsyncStorage";
import AppContext from "../Helpers/UseContextStorage";

function Login() {
  const navigation = useNavigation();

  const { setUser, expoPushToken } = useContext(AppContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loader, setLoader] = useState(false);

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const handleLogin = async () => {
    if (validateInputs()) {
      setLoader(true);
      const response = await userLogin(credentials);
      const res = await update(response.data.user._id, {
        deviceId: JSON.stringify(expoPushToken),
      });
      if (response.status === 200) {
        await AsyncService.login(response.data.user);
        setUser(response.data.user);
        setLoader(false);

        navigation.navigate("Main");
      } else {
        setLoader(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          message: response.data.message,
        }));
      }
    }
  };

  const validateInputs = () => {
    const { email, password } = credentials;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // Validate email
    if (!email || !email.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
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
    } else if (password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password should be at least 6 characters",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "", // Clear the password error message
      }));
    }

    return isValid;
  };

  const redirect = () => {
    navigation.navigate("SignUp");
  };
  const redirectForgot = () => {
    navigation.navigate("ForgotPassword");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <View style={styles.mainTextConatiner}>
        <CustomText style={styles.mainText} bold={true}>
          Welcome!
        </CustomText>
        <View style={styles.inputContainer}>
          <CustomText style={styles.inputText} bold={false}>
            Email
          </CustomText>
          <TextInput
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

        <View style={styles.inputPassContain}>
          <CustomText style={styles.inputText} bold={false}>
            Password
          </CustomText>
          <View style={styles.postion__relative}>
            <TextInput
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

        <View style={styles.ButtonLoginContains}>
          {!!errors.message && (
            <CustomText style={styles.resErrortext} bold={false}>
              {errors.message}
            </CustomText>
          )}
          <Button
            onPressOk={handleLogin}
            title="Login"
            isButtonFirst={true}
            isLoading={loader}
          />
        </View>
        <TouchableOpacity onPress={redirectForgot}>
          <CustomText style={styles.forgotPassText} bold={false}>
            Forgot password
          </CustomText>
        </TouchableOpacity>
        <View style={styles.align_center}>
          <View style={styles.socialBorder}></View>
          <View style={styles.socialTextContains}>
            <CustomText style={styles.socialLogin} bold={false}>
              Or Login using
            </CustomText>
          </View>
        </View>

        <View style={styles.socialIconContains}>
          <View style={styles.iconWrapper}>
            <View style={styles.icon_text}>
              <Image
                style={styles.facebookIcon}
                source={require("../assets/Facebook.png")}
                resizeMode="contain"
              />
              <CustomText style={styles.text_icon} bold={true}>
                Facebook
              </CustomText>
            </View>
            <View style={styles.icon_text}>
              <Image
                style={styles.facebookIcon}
                source={require("../assets/Google.png")}
                resizeMode="contain"
              />
              <CustomText style={styles.text_iconGoogle} bold={true}>
                Google
              </CustomText>
            </View>
            <View style={styles.icon_text}>
              <Image
                style={styles.facebookIcon}
                source={require("../assets/Instagram.png")}
                resizeMode="contain"
              />
              <CustomText style={styles.text_iconInsta} bold={true}>
                Instagram
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.signUp}>
          <View style={styles.iconWrapper}>
            <CustomText style={styles.forgot_pass} bold={false}>
              Don’t have an account?
            </CustomText>

            <TouchableOpacity onPress={redirect}>
              <CustomText style={styles.signUpLink}> SignUp</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },

  postion__relative: {
    position: "relative",
  },

  mainTextConatiner: {
    position: "absolute",
    top: 100,
    width: "100%",
    paddingHorizontal: 30,
  },
  inputContainer: {
    top: 50,
  },

  inputText: {
    fontSize: 10,
    color: "#393939",
  },

  resErrortext: {
    color: "red",
    marginBottom: 8,
    fontSize: 10,
    textAlign: "center",
  },

  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    bottom: 0,
  },

  input: {
    height: 50,
    borderColor: "#B6B6B6",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 8,
  },

  mainText: {
    fontSize: 33,
  },
  ButtonLoginContains: {
    marginTop: 10,
  },

  inputPassContain: {
    marginTop: 70,
    marginBottom: 30,
  },

  forgotPassText: {
    fontSize: 14,
    fontWeight: 400,
    color: "#909090",
    textAlign: "center",
  },

  align_center: {
    alignItems: "center",
    marginTop: 20,
  },
  socialTextContains: {
    width: 150,
    height: 33,
    backgroundColor: "#C43E1A",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  socialBorder: {
    borderWidth: 1,
    borderColor: "#D1D4E0",
    width: 300,
    top: 15,
    position: "absolute",
    zIndex: -1, // Set a negative zIndex to place the border behind the box
  },
  socialLogin: {
    fontSize: 13,
    color: "white",
  },

  socialIconContains: {
    flex: 1,
    marginTop: 30,
  },
  iconWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  forgot_pass: {
    color: "black",
    fontSize: 14,
  },

  signUp: {
    alignItems: "center",
    marginTop: 20,
  },

  signUpLink: {
    color: "#C43E1A",
    fontSize: 14,
  },

  text_icon: {
    fontSize: 12,
    color: "#3F51B4",
  },
  text_iconInsta: {
    fontSize: 12,
    color: "#E34577",
  },
  text_iconGoogle: {
    fontSize: 12,
    color: "#1976D2",
  },
  icon_text: {
    alignItems: "center",
  },

  facebookIcon: {
    width: 32,
    height: 32,
    marginBottom: 10,
  },
});

export default Login;
