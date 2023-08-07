import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./Navigator";
import { AppProvider } from "./app/Helpers/UseContextStorage";

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
