import React, { useContext, useState } from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "../Helpers/Header";
import CustomText from "../Helpers/CustomText";
import ViewOrder from "../Helpers/ViewOrder";
import CompletedOrders from "../Helpers/CompletedOrders";
import { useFocusEffect } from "@react-navigation/native";
import {
  getOrderByUserId,
  getOrderByUserIdStatus,
} from "../Services/OrderService";
import AppContext from "../Helpers/UseContextStorage";

function History() {
  const [activeTab, setActiveTab] = useState("Tab1");
  const { user, orderData, setOrderData } = useContext(AppContext);

  const [loader, setLoader] = useState(false);
  const [btnLock, setBtnLock] = useState(false);

  const [ordersHistory, setOrdersHistory] = useState();

  const handleTabPress = async (tab) => {
    if (tab === "Tab2") {
      setBtnLock(true);
      const response = await getOrderByUserIdStatus(user._id);
      if (response.status === 200) {
        setOrdersHistory(response.data);
      }
      setBtnLock(false);
    }
    setActiveTab(tab);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    setLoader(true);
    const response = await getOrderByUserId(user._id);

    if (response.status === 200) {
      setOrderData(response?.data[0]);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "Tab1") {
      return (
        <>
          {loader ? (
            <>
              <ActivityIndicator
                size="large"
                color="red"
                style={styles.spinner}
              />
            </>
          ) : orderData ? (
            <ViewOrder orderData={orderData} />
          ) : (
            <CustomText bold={false} style={styles.order_none}>
              No active orders
            </CustomText>
          )}
        </>
      );
    } else if (activeTab === "Tab2") {
      return (
        <View style={styles.cartContains}>
          {btnLock ? (
            <>
              <ActivityIndicator
                size="large"
                color="red"
                style={styles.spinner}
              />
            </>
          ) : (
            ordersHistory?.reverse()?.map((i, index) => {
              return <CompletedOrders data={i} key={`order_${index}`} />;
            })
          )}
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
                History
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

  spinner: {
    paddingTop: 130,
  },

  cartContains: {
    paddingVertical: 30,
  },

  order_none: {
    textAlign: "center",
    verticalAlign: "middle",
    justifyContent: "center",
    paddingVertical: 150,
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
