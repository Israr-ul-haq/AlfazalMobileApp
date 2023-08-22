import AsyncStorage from "@react-native-async-storage/async-storage";

const AsyncService = {
  async login(user) {
    // Your login logic here (e.g., API call to authenticate user)
    // Once authenticated, save the login state and user object in AsyncStorage
    await AsyncStorage.setItem("isLoggedIn", "true");
    await AsyncStorage.setItem("user", JSON.stringify(user));
  },

  async logout() {
    // Your logout logic here (e.g., API call to log out user)
    // Remove the login state and user object from AsyncStorage
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("user");
  },

  async isLoggedIn() {
    // Check if the user is logged in by fetching the login state from AsyncStorage
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    return isLoggedIn === "true";
  },

  async getUser() {
    // Retrieve the user object from AsyncStorage and parse it from JSON string
    const userJson = await AsyncStorage.getItem("user");
    return JSON.parse(userJson);
  },

  async updateUser(newUserData) {
    console.log("updateUser", newUserData);
    try {
      const userJson = await AsyncStorage.getItem("user");
      const currentUser = JSON.parse(userJson);

      // Merge the new user data with the current user data
      const updatedUser = { ...currentUser, ...newUserData };

      // Save the updated user data back to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data in AsyncStorage:", error);
    }
  },
};

export default AsyncService;
