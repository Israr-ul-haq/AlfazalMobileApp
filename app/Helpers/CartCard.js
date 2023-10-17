import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import cartImage from "../assets/cartImage.png";
import CustomText from "./CustomText";
import CartCounter from "./Cart_counter";
import { DeleteIcon } from "./SVGs";
import { TouchableOpacity } from "react-native";
import DeleteModal from "./DeleteModal";
import { deleteCartData } from "../Services/CartService";


function CartCard({
  data,
  cartData,
  setCartData,
  userId,
  setCartCount,
  setProductsData,
}) {
  const totalPrice = data?.item?.SalePrice * data?.count;

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [btnLock, setBtnLoack] = useState(false);

  const handleDelete = async () => {
    try {
      setBtnLoack(true);
      const response = await deleteCartData(userId, data?.item?._id);
      if (response.status === 200) {
        setCartCount((prevCartCount) => prevCartCount - 1);
        setCartData((prevData) =>
          prevData.filter((item) => item.item._id !== data?.item?._id)
        );
        setProductsData((prevData) => {
          const updatedData = prevData.map((item) => {
            if (item._id === data.item._id) {
              return {
                ...item,
                isCartAdded: false,
                count: 0,
              };
            }
            return item;
          });

          return updatedData;
        });

        setBtnLoack(false);
      } else {
        console.log("Failed to delete on the server");
        setBtnLoack(false);
      }
    } catch (error) {
      console.error("Error updating count:", error);
      setBtnLoack(false);
    }
    setIsDeleteModalVisible(false);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false); // Hide the delete modal if canceled
  };

  return (
    <View style={styles.CartCard}>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => setIsDeleteModalVisible(true)}
      >
        <DeleteIcon />
      </TouchableOpacity>
      <View style={styles.cart_inner_contain}>
        {data?.item?.img ? (
          <Image
            source={{
              uri:  data?.item?.img,
            }}
            style={styles.cart_image}
            resizeMode={"contain"}
          />
        ) : (
          <Image
            source={cartImage}
            style={styles.cart_image}
            resizeMode={"contain"}
          />
        )}

        <View style={styles.text_content}>
          <CustomText bold={false} style={styles.card_text}>
            {data?.item?.Name}
          </CustomText>
          <CustomText bold={false} style={styles.para}>
            {data?.item?.Description}
          </CustomText>
          <View style={styles.count_contain}>
            <CustomText bold={true} style={styles.price}>
              Rs:{totalPrice}
            </CustomText>
            <CartCounter
              data={data}
              cartData={cartData}
              setCartData={setCartData}
            />
          </View>
          <View style={styles.counter_}></View>
        </View>
      </View>

      <DeleteModal
        isVisible={isDeleteModalVisible}
        onDelete={handleDelete}
        onCancel={handleCancel}
        btnLock={btnLock}
        deleteText={"Are you sure you want to delete this item?"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  CartCard: {
    width: "100%",
    backgroundColor: "#C43E1A42",
    borderRadius: 10,
    marginBottom: 10,
    position: "relative",
  },

  cart_image: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },

  deleteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  cart_inner_contain: {
    padding: 6,
    flexDirection: "row",
  },
  card_text: {
    fontSize: 14,
    color: "#000000",
    width: 155,
  },
  text_content: {
    paddingLeft: 10,
  },
  para: {
    fontSize: 10,
    color: "#707070",
    width: 180,
  },

  price: {
    fontSize: 15,
    color: "#B22310",
    paddingRight: 5,
  },

  count_contain: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  counter_: {
    paddingTop: 10,
  },
});

export default CartCard;
