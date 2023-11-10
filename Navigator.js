import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import GettingStarted from "./app/screens/GettingStarted";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import BottomBarMenu from "./app/Helpers/BottomBar";
import ViewProduct from "./app/screens/ViewProduct";

import PaymentScreen from "./app/screens/PaymentScreen";
import OrderScreen from "./app/screens/OrderScreen";
import History from "./app/screens/History";
import EditProfile from "./app/screens/EditProfile";
import ForgotPassword from "./app/screens/ForgotPassword";
import AsyncService from "./app/Services/AsyncStorage";
import { useEffect, useState, useContext, useRef } from "react";
import AppContext from "./app/Helpers/UseContextStorage";
import Map from "./app/screens/Map";

import * as Notifications from "expo-notifications";

import { Alert, BackHandler, Platform, StatusBar } from "react-native";
import ReviewModal from "./app/Helpers/ReviewModal";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { refreshLocation } from "./app/Helpers/RefreshLocation";
import messaging from "@react-native-firebase/messaging";
import { update } from "./app/Services/AuthService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppNavigator = () => {
  const {
    isWelcomeScreen,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    setExpoPushToken,
    setOrderData,
    user,
    setCurrentLocation,
    setIsWelcomeScreen,
  } = useContext(AppContext);
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Check the login state on app startup
    checkLocation();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const loggedIn = await AsyncService.isLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // If the user is logged in, fetch and set the user object
      const fetchedUser = await AsyncService.getUser();
      setUser(fetchedUser);
      if (fetchedUser.orderReviewStatus) {
        openModal();
      }

      navigation.navigate("Main");
    } else {
      navigation.navigate("GettingStarted");
    }
    setIsWelcomeScreen(true);
  };

  const checkLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync({
      enableHighAccuracy: true,
    });
    if (status !== "granted") {
      console.log("Permission to access location was denied");

      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied. Would you like to open settings to enable it?",
        [
          {
            text: "Open Settings",
            onPress: () => {
              // Open the app's settings using Linking
              Linking.openSettings();
            },
          },
          {
            text: "Exit App",
            onPress: () => {
              // Exit the app when the user chooses "Exit App"
              BackHandler.exitApp();
            },
          },
        ]
      );
    } else {
      const location = await refreshLocation();
      setCurrentLocation(location);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const updateUserAndStorage = async (updatedUser) => {
    await AsyncService.updateUser(updatedUser);
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then(async (token) => {
          setExpoPushToken(token);

          const loggedIn = await AsyncService.isLoggedIn();

          if (loggedIn && user._id) {
            const res = await update(user?._id, {
              deviceId: token,
            });

            console.log(token, "api update token");
          }
        });
    } else {
      console.log("Failed token status");
    }

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
      const notificationData = JSON.parse(remoteMessage.data.orderData);
      console.log("Notification data:", notificationData);
      if (notificationData.orderStatus === "complete") {
        setOrderData();
        openModal();
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            orderReviewStatus: true,
            latestOrderId: notificationData._id,
          };
          updateUserAndStorage(updatedUser); // Call the async function
          return updatedUser;
        });
      } else {
        setOrderData(notificationData);
      }
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
      const notificationData = JSON.parse(remoteMessage.data.orderData);
      console.log("Notification data:", notificationData);
      if (notificationData.orderStatus === "complete") {
        setOrderData();
        openModal();
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            orderReviewStatus: true,
            latestOrderId: notificationData._id,
          };
          updateUserAndStorage(updatedUser); // Call the async function
          return updatedUser;
        });
      } else {
        setOrderData(notificationData);
      }

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: remoteMessage.notification.title,
        textBody: remoteMessage.notification.body,
      });

      console.log(remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator>
        {/* {!isWelcomeScreen && (
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
        )} */}

        {!isLoggedIn && (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              header: () => null, // Render a custom empty header component
            }}
          />
        )}
        {!isLoggedIn && (
          <Stack.Screen
            name="GettingStarted"
            component={GettingStarted}
            options={{
              header: () => null, // Render a custom empty header component
            }}
          />
        )}

        <Stack.Screen
          name="Main"
          options={{
            header: () => null, // Render a custom empty header component
          }}
        >
          {() => <BottomBarMenu />}
        </Stack.Screen>

        <Stack.Screen
          name="ViewProduct"
          component={ViewProduct}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />

        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            header: () => null, // Render a custom empty header component
          }}
        />
      </Stack.Navigator>

      <ReviewModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        user={user}
        setUser={setUser}
        updateUserAndStorage={updateUserAndStorage}
      />
    </>
  );
};

export default AppNavigator;
