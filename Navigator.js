import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import GettingStarted from "./app/screens/GettingStarted";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="GettingStarted"
      component={GettingStarted}
      options={{
        header: () => null, // Render a custom empty header component
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
