import * as Location from "expo-location";

export const refreshLocation = async () => {
  try {
    let currentLocation = await Location.getCurrentPositionAsync({});
    return currentLocation;
  } catch (error) {
    console.error("Error fetching location:", error);
    // Handle any errors that occurred while fetching the location.
    // You can display an error message to the user or take appropriate actions.
  }
};
