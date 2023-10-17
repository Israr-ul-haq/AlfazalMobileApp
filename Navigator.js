import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import GettingStarted from "./app/screens/GettingStarted";
import Login from "./app/screens/Login";
import SignUp from "./app/screens/SignUp";
import BottomBarMenu from "./app/Helpers/BottomBar";
import ViewProduct from "./app/screens/ViewProduct";
import Cart from "./app/screens/Cart";
import PaymentScreen from "./app/screens/PaymentScreen";
import OrderScreen from "./app/screens/OrderScreen";
import History from "./app/screens/History";
import EditProfile from "./app/screens/EditProfile";
import ForgotPassword from "./app/screens/ForgotPassword";
import AsyncService from "./app/Services/AsyncStorage";
import { useEffect, useState, useContext, useRef } from "react";
import AppContext from "./app/Helpers/UseContextStorage";
import Map from "./app/screens/Map";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, BackHandler, Platform } from "react-native";
import ReviewModal from "./app/Helpers/ReviewModal";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { refreshLocation } from "./app/Helpers/RefreshLocation";

// import firebase from "./firebase"; // Import the firebase configuration

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

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
  } = useContext(AppContext);

  const notificationListener = useRef();
  const responseListener = useRef();

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
    }
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

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Received notification:", notification);
        const notificationData = notification.request.content.data;
        console.log("Notification data:", notificationData);
        if (notificationData.orderData[0].orderStatus === "complete") {
          setOrderData();
          openModal();
          setUser((prevUser) => {
            const updatedUser = {
              ...prevUser,
              orderReviewStatus: true,
              latestOrderId: notificationData.orderData[0]._id,
            };
            updateUserAndStorage(updatedUser); // Call the async function
            return updatedUser;
          });
        } else {
          setOrderData(notificationData.orderData[0]);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response, "token");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <Stack.Navigator>
        {!isWelcomeScreen && (
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
        )}

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
        <Stack.Screen
          name="Main"
          options={{
            header: () => null, // Render a custom empty header component
          }}
        >
          {() => <BottomBarMenu />}
        </Stack.Screen>
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
