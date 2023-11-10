import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./Navigator";
import { AppProvider } from "./app/Helpers/UseContextStorage";
import { AlertNotificationRoot } from "react-native-alert-notification";

const App = () => {
  return (
    <AppProvider>
      <AlertNotificationRoot theme="dark">
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AlertNotificationRoot>
    </AppProvider>
  );
};

export default App;
