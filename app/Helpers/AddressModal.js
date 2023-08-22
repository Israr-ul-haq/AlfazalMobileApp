import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import CustomText from "./CustomText";
import AsyncService from "../Services/AsyncStorage";
import { updateAddressStatus } from "../Services/AuthService";

const AddressModal = ({ isModalVisible, toggleModal, user, setUser }) => {
  const navigation = useNavigation();
  const [isMenuVisibleArray, setIsMenuVisibleArray] = useState([]);

  const updateUserAndStorage = async (updatedUser) => {
    setUser(updatedUser);
    await AsyncService.updateUser(updatedUser);
  };

  // Function to toggle the menu visibility for a specific index
  const toggleMenu = (index) => {
    const newIsMenuVisibleArray = [...isMenuVisibleArray];
    newIsMenuVisibleArray[index] = !newIsMenuVisibleArray[index];
    setIsMenuVisibleArray(newIsMenuVisibleArray);
  };

  const handlePress = async (selected, id) => {
    setUser((prevUser) => {
      const updatedAddresses = prevUser.addresses.map((address) => {
        return {
          ...address,
          isSelected: address._id === id ? !selected : false,
        };
      });
      const updatedUser = {
        ...prevUser,
        addresses: updatedAddresses,
      };
      updateUserAndStorage(updatedUser); // Call the async function
      return updatedUser;
    });

    try {
      const response = await updateAddressStatus(user._id, id, selected);
      if (response.status === 200) {
        console.log("user status updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp" // Set the animation type
        animationOut="slideOutDown" // Set the animation type
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Select Location</Text>
          <TouchableOpacity style={styles.load_section} onPress={navigate}>
            <CustomText>ADD</CustomText>
          </TouchableOpacity>

          <ScrollView style={styles.scrollContainer}>
            {user?.addresses?.map((i, index) => {
              return (
                <View style={styles.location_contains}>
                  <RadioButton.Item
                    label={i.mapAddress}
                    color="red"
                    key={`cart_${index}`}
                    status={i?.isSelected ? "checked" : "unchecked"}
                    onPress={() => handlePress(i.isSelected, i._id)}
                    labelStyle={{ marginRight: 20 }}
                  />
                  <TouchableOpacity onPress={() => toggleMenu(index)}>
                    <Text>....</Text>
                  </TouchableOpacity>
                  {isMenuVisibleArray[index] && (
                    <View>
                      <TouchableOpacity onPress={() => console.log("Option 1")}>
                        <Text>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Button title="Close" onPress={toggleModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },

  scrollContainer: {
    flexGrow: 1,
    height: 250,
  },

  location_contains: {
    flexDirection: "row",
  },
});

export default AddressModal;
