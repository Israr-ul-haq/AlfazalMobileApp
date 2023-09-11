import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "../Helpers/Header";
import { Edit, Location } from "../Helpers/SVGs";
import CustomText from "../Helpers/CustomText";
import MapImage from "../assets/Map.png";
import PaymentCardOptions from "../Helpers/PaymentCardOptions";
import SubTotalCard from "../Helpers/SubTotalCard";
import AppContext from "../Helpers/UseContextStorage";
import AddressModal from "../Helpers/AddressModal";
import MapView, { Marker, Polyline } from "react-native-maps";
import { getDirections } from "../Services/AuthService";
import { decodePolyline } from "../Helpers/DecodePolyline";
import { baseURL, lookupsId } from "../Constants/axios.config";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getLookups } from "../Services/LookupsService";
import GrandTotal from "../Helpers/GrandTotal";
import { CreateOrder } from "../Services/OrderService";
import { IsPointInPolygon } from "../Helpers/MapPolygon";

function PaymentScreen() {
  const {
    grandTotal,
    setGrandTotal,
    user,
    setUser,
    setModalVisible,
    isModalVisible,
    mapApiStatus,
    setMapApiStatus,
    cartData,
  } = useContext(AppContext);

  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [initialRegion, setInitialRegion] = useState();
  const [loader, setLoader] = useState(false);
  const [shopLocation, setShopLocation] = useState();

  const [distance, setDistance] = useState("");
  const [polyline_points, setPolylinePoints] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [errors, setErrors] = useState({
    message: "",
  });

  const [lookupsData, setLookupsData] = useState();

  const navigation = useNavigation();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    console.log("data");
    setMapVisible(true);
    setLoader(true);
    // Filter out addresses with isSelected set to true
    const filteredAddresses = user?.addresses?.filter(
      (address) => address.isSelected
    );

    if (filteredAddresses.length !== 0) {
      getMapDirections(
        parseFloat(filteredAddresses[0].lat),
        parseFloat(filteredAddresses[0].lng)
      );

      setSelectedAddresses(filteredAddresses);
      setLoader(false);
    } else {
      setSelectedAddresses([]);
      setMapVisible(false);
      setLoader(false);
      setFinalPrice(0);
      setDeliveryCharges(0);
    }
  }, [mapApiStatus]);

  const getMapDirections = async (lat, lng) => {
    try {
      const response = await getLookups(lookupsId);
      const { distance, polylinePoints } = await getDirections(
        response.data.ShopLocation.Latitude,
        response.data.ShopLocation.Longitude,
        lat,
        lng
      );

      const intial = {
        latitude: (response.data.ShopLocation.Latitude + parseFloat(lat)) / 2,
        longitude: (response.data.ShopLocation.Longitude + parseFloat(lng)) / 2,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };

      setInitialRegion(intial);

      setLookupsData(response.data);

      const distanceValue = parseFloat(distance.replace("Km", "").trim());
      if (!isNaN(distanceValue)) {
        if (response.data.KmRangeLimit < distanceValue) {
          const perPerPrice = response.data.Rate_Per_Kilometer;
          const result = perPerPrice * distanceValue;
          const newGrandTotal = grandTotal + result;
          setFinalPrice(newGrandTotal);
          setDeliveryCharges(result);
        } else {
          const result = response.data.RangeFixedDeliveryCharges;
          const newGrandTotal = grandTotal + result;
          setFinalPrice(newGrandTotal);
          setDeliveryCharges(result);
        }
        setShopLocation({
          lat: response.data.ShopLocation.Latitude,
          lng: response.data.ShopLocation.Longitude,
        });

        setMapVisible(false);
      } else {
        console.log("Invalid distance value");
        setMapVisible(false);
      }
      setDistance(distance);
      setPolylinePoints(polylinePoints);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Validate name
    if (selectedAddresses.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "Please select a address",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "", // Clear the name error message
      }));
    }
    if (selectedAddresses.length !== 0) {
      const updatedLocation = {
        latitude: selectedAddresses[0].lat,
        longitude: selectedAddresses[0].lng,
      };

      const isInsidePolygon = IsPointInPolygon(
        updatedLocation,
        lookupsData.MapRangeLimit
      );
      if (!isInsidePolygon) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          message:
            "Location out of delivery range. We apologize, but we do not deliver to this area",
        }));
        isValid = false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          message: "",
        }));
      }
    }

    const timeZone = "Asia/Karachi";

    // Create options for formatting time
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
      timeZone, // Set the time zone
    };

    // Get the current time in the Pakistan time zone
    const currentDateTime = new Date().toLocaleTimeString("en-US", timeOptions);

    // Get the shop's opening and closing times in the Pakistan time zone
    const shopOpenTime = new Date(
      lookupsData.ShopOpeningsTiming
    ).toLocaleTimeString("en-US", timeOptions);
    const shopCloseTime = new Date(
      lookupsData.ShopClosingTiming
    ).toLocaleTimeString("en-US", timeOptions);

    if (currentDateTime < shopOpenTime || currentDateTime > shopCloseTime) {
      // Shop is closed, show error message with timing
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: `Shop is closed. Open from ${shopOpenTime} to ${shopCloseTime}`,
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "",
      }));
    }

    return isValid;
  };

  const redirect = async () => {
    if (validateInputs()) {
      setLoader(true);
      const finalData = {
        userId: user._id,
        createdBy: user._id,
        paymentStatus: "Cash on delivery",
        orderStatus: "pending",
        address: selectedAddresses[0],
        items: cartData,
        deliveryCharges: deliveryCharges,
        totalAmount: finalPrice,
        distance: distance,
      };
      try {
        const response = await CreateOrder(finalData);
        console.log(response);
        if (response.status === 200) {
          navigation.navigate("Order");
          setLoader(false);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            message: response.data.message,
          }));

          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Order"} isBack={true} navigateUrl={"Cart"} />
      <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
        {selectedAddresses?.length === 0 ? (
          <CustomText bold={false} style={styles.no_address}>
            Map could not load please select address
          </CustomText>
        ) : mapVisible ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <MapView
            style={{ flex: 1, height: 300 }}
            initialRegion={initialRegion}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(selectedAddresses[0]?.lat),
                longitude: parseFloat(selectedAddresses[0]?.lng),
              }}
            >
              <View style={styles.markerContainer}>
                <ImageBackground
                  source={{ uri: baseURL + user?.img }}
                  style={styles.markerIcon}
                  imageStyle={styles.circleImage}
                ></ImageBackground>
                <View style={styles.pointer} />
              </View>
            </Marker>
            <Marker
              coordinate={{
                latitude: shopLocation?.lat,
                longitude: shopLocation?.lng,
              }}
            >
              <View style={styles.markerContainer}>
                <ImageBackground
                  source={require("../assets/logo-placeholder.png")}
                  style={styles.markerIcon}
                  imageStyle={styles.circleImage}
                ></ImageBackground>
                <View style={styles.pointer} />
              </View>
            </Marker>

            <Polyline
              coordinates={decodePolyline(polyline_points)} // You need to decode polyline points
              strokeColor="#000"
              strokeWidth={4}
            />
          </MapView>
        )}
        <View>
          <View style={styles.container}>
            <View style={styles.address_contain}>
              <Location />
              {selectedAddresses?.length === 0 ? (
                <CustomText bold={false} style={styles.not_locationText}>
                  No address found
                </CustomText>
              ) : (
                <View style={styles.location}>
                  <CustomText bold={false} style={styles.location_text}>
                    Location
                  </CustomText>
                  <CustomText bold={false} style={styles.address}>
                    {selectedAddresses[0]?.mapAddress}
                  </CustomText>
                  <CustomText bold={false} style={styles.location_text}>
                    Address
                  </CustomText>
                  <CustomText bold={false} style={styles.address}>
                    {selectedAddresses[0]?.fullAddress}
                  </CustomText>
                </View>
              )}

              <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <View style={styles.edit_contains}>
                  <Edit />
                </View>
              </TouchableOpacity>
            </View>
            {/* <Image source={MapImage} style={styles.map_Image} /> */}

            <CustomText bold={false} style={styles.payment_text}>
              Payment method
            </CustomText>

            <PaymentCardOptions />
          </View>
          <GrandTotal
            pageNavigate={"Order"}
            deliveryCharges={deliveryCharges}
            grandTotal={grandTotal}
            finalPrice={finalPrice}
            errors={errors}
            setErrors={setErrors}
            selectedAddresses={selectedAddresses}
            redirect={redirect}
            loader={loader}
          />

          <AddressModal
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
            user={user}
            setUser={setUser}
            mapApiStatus={mapApiStatus}
            setMapApiStatus={setMapApiStatus}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollView: {
    flexGrow: 1,
  },

  location: {
    width: 260,
  },

  location_text: {
    fontSize: 10,
    paddingLeft: 20,
    color: "red",
  },
  not_locationText: {
    fontSize: 10,
    textAlign: "center",
    color: "red",
  },

  no_address: {
    fontSize: 10,
    width: "100%",
    textAlign: "center",
    color: "red",
  },

  edit_contains: {
    padding: 5,
    backgroundColor: "#FED7D7",
    borderRadius: 5,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  address_contain: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  payment: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  payment_text: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 15,
  },

  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of the width and height to create a circle
    justifyContent: "center",
    alignItems: "center",
  },
  circleImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of the width and height to create a circle
  },

  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 12,
    borderTopColor: "red",
    borderLeftWidth: 6,
    borderLeftColor: "transparent",
    borderRightWidth: 6,
    borderRightColor: "transparent",
  },

  border_line: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C43E1A",
    marginBottom: 32,
  },

  map_Image: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 10,
  },

  address: {
    fontSize: 10,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 15,
  },

  payment__card: {
    marginTop: 15,
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  pay_text: {
    fontSize: 16,
  },

  pay_contains: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default PaymentScreen;
