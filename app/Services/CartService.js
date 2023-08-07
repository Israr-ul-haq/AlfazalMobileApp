import axios from "../Constants/axios.config";

export const AddCart = async (body) => {
  try {
    const response = await axios.post(`/addToCart`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const updateCart = async (id, body) => {
  try {
    const response = await axios.put(`/cart/update-count/${id}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getCartItems = async (id) => {
  try {
    const response = await axios.get(`/getCartItemsByUserId/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const deleteCartData = async (userId, itemId) => {
  try {
    const response = await axios.delete(`/cart/deleteItem/${userId}/${itemId}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
