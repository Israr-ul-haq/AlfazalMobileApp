import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomFabBar } from "rn-wave-bottom-bar";
import Home from "../screens/Home";
import SignUp from "../screens/SignUp";
import { HomeSvg, OrdersSvg, ShoppingCartSvg, UserSvg } from "./SVGs";
import Cart from "../screens/Cart";
import History from "../screens/History";
import Profile from "../screens/Profile";
import AppContext from "./UseContextStorage";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();

const BottomBarMenu = () => {
  const { cartCount } = useContext(AppContext);

  const CartIconWithBadge = ({ cartCount }) => {
    return (
      <View>
        <ShoppingCartSvg width={24} height={24} color="black" />
        {cartCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -5,
              right: -10,
              backgroundColor: "red",
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {cartCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

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
          tabBarIcon: ({ color, size }) => (
            <CartIconWithBadge cartCount={cartCount} />
          ),
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
