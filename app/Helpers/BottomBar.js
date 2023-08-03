import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomFabBar } from "rn-wave-bottom-bar";
import Home from "../screens/Home";
import SignUp from "../screens/SignUp";
import { HomeSvg, OrdersSvg, ShoppingCartSvg, UserSvg } from "./SVGs";
import Cart from "../screens/Cart";
import History from "../screens/History";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

const BottomBarMenu = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#C43E1A",
        tabBarActiveBackgroundColor: "#C43E1A",
        tabBarInactiveBackgroundColor: "#C43E1A",
      }}
      tabBar={(props) => (
        <BottomFabBar
          mode="default"
          isRtl={false}
          focusedButtonStyle={{
            shadowColor: "transparent",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 14,
            backgroundColor: "#C43E1A",
          }}
          bottomBarContainerStyle={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => <HomeSvg />,
          header: () => null,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: () => <ShoppingCartSvg />,
          header: () => null,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: () => <OrdersSvg />,
          header: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => <UserSvg />,
          header: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomBarMenu;
