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
import { useEffect, useState, useContext } from "react";
import AppContext from "./app/Helpers/UseContextStorage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { isWelcomeScreen, setUser } = useContext(AppContext);

  useEffect(() => {
    // Check the login state on app startup
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    // console.log("logout");
    // const logout = await AsyncService.logout();
    const loggedIn = await AsyncService.isLoggedIn();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // If the user is logged in, fetch and set the user object
      const fetchedUser = await AsyncService.getUser();
      setUser(fetchedUser);
    }
  };

  return (
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
  );
};

export default AppNavigator;
