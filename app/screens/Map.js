import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Header from "../Helpers/Header";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import {
  PanGestureHandler,
  ScrollView,
  State,
} from "react-native-gesture-handler";
import AppContext from "../Helpers/UseContextStorage";
import { Image } from "react-native";
import { baseURL, googleApiKey, lookupsId } from "../Constants/axios.config";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import CustomText from "../Helpers/CustomText";
import { TextInput } from "react-native";
import Button from "../Helpers/Buttons";
import { update } from "../Services/AuthService";
import { Location as LocationMarker } from "../Helpers/SVGs";
import AsyncService from "../Services/AsyncStorage";
import { debounce, throttle } from "lodash";
import { IsPointInPolygon } from "../Helpers/MapPolygon";
import { getLookups } from "../Services/LookupsService";

function Map() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [markerScreenPosition, setMarkerScreenPosition] = useState({
    x: 0,
    y: 0,
  });
  const [mapVisible, setMapVisible] = useState(false);
  const {
    user,
    setUser,
    isModalVisible,
    setModalVisible,
    mapApiStatus,
    setMapApiStatus,
  } = useContext(AppContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [credentials, setCredentials] = useState({
    address: "",
  });

  const [polygonCordinates, setPolygonCordinates] = useState([]);

  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();

  const [errors, setErrors] = useState({
    address: "",
    message: "",
  });

  // useFocusEffect(
  //   React.useCallback(() => {

  //   }, [])
  // );

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoader(true);
    console.log("data");
    const response = await getLookups(lookupsId);

    if (response.status === 200) {
      setPolygonCordinates(response.data.MapRangeLimit);
    }

    let { status } = await Location.requestForegroundPermissionsAsync({
      enableHighAccuracy: true,
    });
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    const currentPoint = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    const isInsidePolygon = IsPointInPolygon(
      currentPoint,
      response.data.MapRangeLimit
    );
    if (!isInsidePolygon) {
      setLoader(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        message:
          "Location out of delivery range. We apologize, but we do not deliver to this area",
      }));

      console.log(isInsidePolygon);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "",
      }));

      console.log(isInsidePolygon);
    }
    const newLocation = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    if (mapRef.current) {
      mapRef.current.fitToCoordinates([newLocation], {
        edgePadding: {
          top: 50, // Adjust this value as needed
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }

    const addressResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLocation.latitude},${newLocation.longitude}&key=${googleApiKey}`
    );
    const addressData = await addressResponse.json();
    if (addressData.results.length > 0) {
      setAddress(addressData.results[0].formatted_address);
    }
    setLoader(false);
    setLocation(newLocation);
    setMapVisible(true);
  };

  let addressUpdateTimer;

  const handleMarkerDragEnd = (e) => {
    setLoader(true);

    const updatedLocation = {
      latitude: e.latitude,
      longitude: e.longitude,
    };

    // Clear the existing timer
    clearTimeout(addressUpdateTimer);

    // Start a new timer to delay the API call
    addressUpdateTimer = setTimeout(async () => {
      try {
        // Get the address from the updated location using Google Places API
        const addressResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${updatedLocation.latitude},${updatedLocation.longitude}&key=${googleApiKey}`
        );
        const addressData = await addressResponse.json();
        console.log(polygonCordinates);
        const isInsidePolygon = IsPointInPolygon(
          updatedLocation,
          polygonCordinates
        );
        if (!isInsidePolygon) {
          setLoader(false);
          setErrors((prevErrors) => ({
            ...prevErrors,
            message:
              "Location out of delivery range. We apologize, but we do not deliver to this area",
          }));
          console.log(isInsidePolygon);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            message: "",
          }));
          console.log(isInsidePolygon);
        }

        if (addressData.results.length > 0) {
          setAddress(addressData.results[0].formatted_address);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoader(false);
      }
    }, 500); // Adjust the delay as needed
  };

  const handleRelocate = () => {
    if (mapRef.current && location) {
      getCurrentLocation();
    }
  };

  const throttledHandleMarkerDragEnd = throttle(handleMarkerDragEnd, 300);

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const handleSubmit = async () => {
    setLoader(true);
    if (errors.message !== "") {
      setLoader(false);
      return;
    }
    const finalUserData = {
      newAddress: {
        lat: location.latitude,
        lng: location.longitude,
        isSelected: true,
        fullAddress: credentials.address,
        mapAddress: address,
      },
    };

    try {
      const response = await update(user._id, finalUserData);

      console.log(response);

      if (response.status === 200) {
        // Create a new user object with updated addresses and the new address added
        const updatedUser = {
          ...user,
          addresses: response?.data?.user?.addresses,
        };

        // Update the state with the new user object
        setUser(updatedUser);
        setModalVisible(false); // Simplify toggling modal visibility
        setMapApiStatus((prevMapApiStatus) => !prevMapApiStatus); // Toggle the map API status

        // Update the user asynchronously
        await AsyncService.updateUser(updatedUser);
        setLoader(false);

        navigation.navigate("Payment");
      } else {
        setLoader(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          message: response.data.message,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const convertedDeliveryAreaPolygon = polygonCordinates.map((point) => ({
    latitude: point.lat,
    longitude: point.lng,
  }));

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header
        text={"Location"}
        isBack={true}
        navigateUrl={"Payment"}
        checkText={"Map"}
        setModalVisible={setModalVisible}
        isModalVisible={isModalVisible}
      />

      {mapVisible ? (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          pointsOfInterest
          mapType="standard"
          onRegionChangeComplete={(newRegion) => {
            setLocation(newRegion);
            throttledHandleMarkerDragEnd(newRegion);
          }}
          zoomEnabled={true}
          minDelta={0.009} // Adjust this value as needed
          onLayout={() => {
            if (!mapLoaded && mapRef.current) {
              mapRef.current.fitToCoordinates([location], {
                edgePadding: {
                  top: -10, // Adjust this value as needed
                  right: -10,
                  bottom: -10,
                  left: -10,
                },
                animated: true,
              });
              setMapLoaded(true);
            }
          }}
        >
          <Polygon
            coordinates={convertedDeliveryAreaPolygon}
            fillColor="rgba(0, 0, 0, 0.4)" // Transparent black color
          />
          {location && (
            <Marker
              draggable
              coordinate={location}
              anchor={{ x: 0.5, y: 0.5 }} // Center of the marker
              style={{
                left: markerScreenPosition.x,
                top: markerScreenPosition.y,
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
          )}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="red" style={styles.spinner} />
      )}

      {mapVisible && (
        <>
          <TouchableOpacity
            style={styles.relocateButton}
            onPress={handleRelocate}
          >
            <Image
              style={styles.relocateButtonImage}
              source={require("../assets/Location2.png")}
            />
          </TouchableOpacity>
          <View style={styles.contains}>
            <View style={styles.map_address}>
              {address && (
                <View style={styles.text_div}>
                  <Text style={styles.addressText}>{address}</Text>
                  <View>
                    <LocationMarker />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomText style={styles.inputText} bold={false}>
                Home Address
              </CustomText>
              <TextInput
                style={[styles.input]} // Apply error styles if there is an error
                onChangeText={(text) => handleInputChange("address", text)}
                value={credentials?.address}
                placeholder="City or Village/House No: /Nearest Place/Street No"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View>
              {!!errors.message && (
                <View style={styles.error_contains}>
                  <CustomText style={styles.errorText} bold={false}>
                    {errors.message}
                  </CustomText>
                </View>
              )}
              <Button
                onPressOk={handleSubmit}
                title="Save"
                isButtonFirst={true}
                isLoading={loader}
              />
            </View>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },

  inputError: {
    borderColor: "red",
  },

  error_contains: {
    textAlign: "center",
    alignItems: "center",
    paddingBottom: 10,
  },

  text_div: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 30,
    gap: 20,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "red", // Set border color to transparent
    borderStyle: "dotted", // Set border style to dotted
    borderRadius: 10,
    width: "100%",
  },

  relocateButtonImage: {
    width: 40,
    height: 40,
  },

  contains: {
    paddingHorizontal: 20,
  },

  inputContainer: {
    paddingVertical: 30,
  },

  map_address: {
    paddingTop: 10,
  },

  errorText: {
    color: "red",

    fontSize: 10,
  },

  inputText: {
    fontSize: 10,
    color: "#393939",
  },
  input: {
    height: 50,
    borderColor: "#B6B6B6",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
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

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
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

  spinner: {
    width: "100%",
    alignItems: "center",
  },

  relocateButton: {
    position: "absolute",
    bottom: 350,
    right: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1, // Ensure the button is above the map
  },

  relocateButtonText: {
    fontWeight: "bold",
  },
});

export default Map;
