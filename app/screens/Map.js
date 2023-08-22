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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";
import AppContext from "../Helpers/UseContextStorage";
import { Image } from "react-native";
import { baseURL, googleApiKey } from "../Constants/axios.config";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import CustomText from "../Helpers/CustomText";
import { TextInput } from "react-native";
import Button from "../Helpers/Buttons";
import { update } from "../Services/AuthService";
import { Location as LocationMarker } from "../Helpers/SVGs";
import AsyncService from "../Services/AsyncStorage";

function Map() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [credentials, setCredentials] = useState({
    address: "",
  });

  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();

  const [errors, setErrors] = useState({
    address: "",
    message: "",
  });

  useFocusEffect(
    React.useCallback(() => {
      getCurrentLocation();
    }, [])
  );

  const getCurrentLocation = async () => {
    setLoader(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

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
      console.log(addressData.results);
      setAddress(addressData.results[0].formatted_address);
    }
    setLoader(false);
    setLocation(newLocation);
    setMapVisible(true);
  };

  const handleMarkerDragEnd = async (e) => {
    setLoader(true);
    console.log("drag map", e);

    const updatedLocation = {
      latitude: e.latitude,
      longitude: e.longitude,
    };
    // // Get the address from the updated location using Google Places API
    const addressResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${updatedLocation.latitude},${updatedLocation.longitude}&key=${googleApiKey}`
    );
    const addressData = await addressResponse.json();
    if (addressData.results.length > 0) {
      console.log(addressData.results);
      setAddress(addressData.results[0].formatted_address);
    }
    setLoader(false);
  };

  const handleRelocate = () => {
    if (mapRef.current && location) {
      getCurrentLocation();
    }
  };

  const handlePlaceSelect = (data, details) => {
    const { lat: latitude, lng: longitude } = details.geometry.location;
    setLocation({ latitude, longitude });

    // Get the address details from the Google Places API response and update the address state
    const address = details.formatted_address;
    setAddress(address);
  };

  const handleInputChange = (field, value) => {
    setCredentials({ ...credentials, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear the error message for the field
  };

  const validateInputs = () => {
    let isValid = true;

    // Validate address
    if (!credentials.address || !credentials.address.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "Address is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "",
      }));
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      setLoader(true);

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

        if (response.status === 200) {
          const updatedAddresses = user?.addresses?.map((address) => ({
            ...address,
            isSelected: false,
          }));
          const updatedUser = { ...user };
          updatedUser.addresses = updatedAddresses;
          updatedUser.addresses.push(finalUserData.newAddress);
          await AsyncService.updateUser(updatedUser);

          navigation.navigate("Main");
          setLoader(false);
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
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/backgroundImage.png")}
    >
      <Header text={"Location"} isBack={true} navigateUrl={"Home"} />

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
          onRegionChange={(newRegion) => setLocation(newRegion)}
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
          onRegionChangeComplete={(e) => handleMarkerDragEnd(e)}
        >
          <Marker
            coordinate={location}
            draggable
            onDragEnd={handleMarkerDragEnd}
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
          {/* <GooglePlacesAutocomplete
            placeholder="Search for an address"
            onPress={handlePlaceSelect}
            value={address}
            query={{
              key: "AIzaSyAC0r847AiujXM9n3nSUEC-XjtN913Ri-8",
              language: "en", // Language of the results
            }}
            // Additional styling if needed
          /> */}
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
                style={[styles.input, !!errors.address && styles.inputError]} // Apply error styles if there is an error
                onChangeText={(text) => handleInputChange("address", text)}
                value={credentials?.address}
                placeholder="City or Village/House No: /Nearest Place/Street No"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                numberOfLines={4}
              />
              {!!errors.address && (
                <CustomText style={styles.errorText} bold={false}>
                  {errors.address}
                </CustomText>
              )}
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

    fontSize: 8,
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
