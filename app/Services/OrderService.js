import axios from "../Constants/axios.config";

export const CreateOrder = async (body) => {
  try {
    const response = await axios.post(`/order/createOrder`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getOrderByUserId = async (id) => {
  try {
    const response = await axios.get(`/orders/user/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getOrderByUserIdStatus = async (id) => {
  try {
    const response = await axios.get(`/orders/status/user/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const submitReview = async (body) => {
  try {
    const response = await axios.post(`/review/create/data`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
