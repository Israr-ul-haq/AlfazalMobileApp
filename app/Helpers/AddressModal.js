import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper";
import CustomText from "./CustomText";
import AsyncService from "../Services/AsyncStorage";
import { deleteAddress, updateAddressStatus } from "../Services/AuthService";
import DeleteModal from "./DeleteModal";
import { ActivityIndicator } from "react-native";
import Button from "./Buttons";

const AddressModal = ({
  isModalVisible,
  toggleModal,
  user,
  setUser,
  setMapApiStatus,
  mapApiStatus,
}) => {
  const navigation = useNavigation();
  const [isMenuVisibleArray, setIsMenuVisibleArray] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [btnLock, setBtnLoack] = useState(false);
  const [loader, setLoader] = useState(false);

  const updateUserAndStorage = async (updatedUser) => {
    await AsyncService.updateUser(updatedUser);
  };

  const toggleMenu = (index, indexStatus) => {
    const newIsMenuVisibleArray = new Array(isMenuVisibleArray.length).fill(
      false
    );
    newIsMenuVisibleArray[index] = !indexStatus;
    setIsMenuVisibleArray(newIsMenuVisibleArray);
  };
  const handlePress = async (selected, id) => {
    console.log(id, selected);

    setLoader(true);
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
        setLoader(false);
        toggleModal();
        setMapApiStatus(!mapApiStatus);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const navigate = () => {
    navigation.navigate("Map");
  };

  const handleDelete = async () => {
    try {
      setBtnLoack(true);
      setUser((prevUser) => {
        // Find the index of the address to be deleted
        const addressIndex = prevUser.addresses.findIndex(
          (address) => address._id === selectedAddressId
        );

        if (addressIndex === -1) {
          return prevUser; // Address not found, no changes needed
        }

        // Create a new array without the address to be deleted
        const updatedAddresses = prevUser.addresses.filter(
          (_, index) => index !== addressIndex
        );

        const updatedUser = {
          ...prevUser,
          addresses: updatedAddresses,
        };

        updateUserAndStorage(updatedUser); // Call the async function

        return updatedUser;
      });

      const response = await deleteAddress(user._id, selectedAddressId);
      if (response.status === 200) {
        console.log("Successfully deleted");
        setMapApiStatus(!mapApiStatus);
        setBtnLoack(false);
        setIsDeleteModalVisible(false);
      } else {
        console.log("Error deleting");
        setBtnLoack(false);
      }
    } catch (error) {
      console.log(error);
      setBtnLoack(false);
    }
  };
  const handleCancel = () => {
    setIsDeleteModalVisible(false); // Hide the delete modal if canceled

    toggleMenu(index);
  };

  const modalToggle = (id) => {
    setSelectedAddressId(id);
    setIsDeleteModalVisible(true);
  };

  const handleRemove = () => {
    toggleModal();
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
          <View style={styles.add_location}>
            <Text style={styles.modalText}>Select Location</Text>
            <TouchableOpacity style={styles.load_section} onPress={navigate}>
              <CustomText style={styles.add_text}>ADD</CustomText>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {loader ? (
              <View style={styles.spinner}>
                <ActivityIndicator size="large" color="red" />
              </View>
            ) : user?.addresses?.length === 0 ? (
              <Text style={styles.noAddressFound}>No Address found</Text>
            ) : (
              user?.addresses?.map((i, index) => {
                return (
                  <View style={styles.location_contains} key={`cart_${index}`}>
                    <View style={styles.radioButtonContainer}>
                      <RadioButton.Item
                        label={i.mapAddress}
                        color="red"
                        status={i?.isSelected ? "checked" : "unchecked"}
                        onPress={() => handlePress(i.isSelected, i._id)}
                        labelStyle={{ width: 210 }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          toggleMenu(index, isMenuVisibleArray[index])
                        }
                      >
                        <Text style={styles.ellipsis}>. . . .</Text>
                      </TouchableOpacity>
                    </View>
                    {isMenuVisibleArray[index] && (
                      <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => modalToggle(i._id)}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>

          <Button
            onPressOk={handleRemove}
            title="Cancel"
            isButtonFirst={true}
            isLoading={loader}
          />
        </View>
      </Modal>

      <DeleteModal
        isVisible={isDeleteModalVisible}
        onDelete={handleDelete}
        onCancel={handleCancel}
        btnLock={btnLock}
        deleteText={"Are you sure you want to delete this address?"}
      />
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
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center", // Align content at the top
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

  noAddressFound: {
    textAlign: "center",
    justifyContent: "center",
    paddingTop: 50,
  },

  spinner: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    textAlign: "center",
  },

  add_location: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    height: 400,
  },

  load_section: {
    backgroundColor: "#C43E1A",
    borderRadius: 20,
  },

  add_text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 5,
    borderColor: "#C43E1A",
    borderWidth: 1,
    borderRadius: 18,
  },

  ellipsis: {
    fontSize: 18,
    fontWeight: "bold", // Make the text bold
    transform: [{ rotate: "-90deg" }], // Rotate the text vertically
  },

  location_contains: {
    position: "relative",
  },

  dropdown: {
    position: "absolute",
    right: 30,
    bottom: 15,
    backgroundColor: "white",
    padding: 5,
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

  deleteText: {
    color: "red",
  },
});

export default AddressModal;
