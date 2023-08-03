import React, { useState } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import ViewOrder from "../Helpers/ViewOrder";
import CompletedOrders from "../Helpers/CompletedOrders";

function History() {
  const [activeTab, setActiveTab] = useState("Tab1");

  const [cartData, setCartData] = useState([
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
    {
      name: "Strawberry Donut",
      description: "Lorem Ipsum is simply",
      price: "1250",
    },
  ]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (activeTab === "Tab1") {
      return <ViewOrder />;
    } else if (activeTab === "Tab2") {
      return (
        <View style={styles.cartContains}>
          {cartData?.map((i, index) => {
            return <CompletedOrders data={i} key={index} />;
          })}
        </View>
      );
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Order"} isBack={false} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        <View style={styles.container}>
          <View style={styles.padding_contain}>
            <TouchableOpacity
              style={[
                styles.tabOverAll,
                activeTab === "Tab1" ? styles.activeTab : styles.inActiveTab,
              ]}
              onPress={() => handleTabPress("Tab1")}
            >
              <CustomText
                style={[
                  activeTab === "Tab1"
                    ? styles.activeText
                    : styles.inActiveText,
                ]}
              >
                Ongoing
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabOverAll,
                activeTab === "Tab2" ? styles.activeTab : styles.inActiveTab,
              ]}
              onPress={() => handleTabPress("Tab2")}
            >
              <CustomText
                style={[
                  activeTab === "Tab2"
                    ? styles.activeText
                    : styles.inActiveText,
                ]}
              >
                Completed
              </CustomText>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },

  cartContains: {
    paddingVertical: 30,
  },

  background: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 50,
  },
  container: {
    paddingHorizontal: 20,
  },

  padding_contain: {
    marginTop: 25,
    backgroundColor: "#EBB68C",
    borderRadius: 230,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 330,
  },

  activeTab: {
    color: "white",
    backgroundColor: "#C43E1A",
  },
  inActiveTab: {
    color: "#2C2C2E",
    backgroundColor: "transparent",
  },
  tabOverAll: {
    borderRadius: 20,
    width: 150,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  activeText: {
    color: "white",
  },
  inActiveText: {
    color: "black",
  },
});

export default History;
