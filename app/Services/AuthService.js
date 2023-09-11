import axios, { googleApiKey } from "../Constants/axios.config";

export const userLogin = async (body) => {
  try {
    const response = await axios.post(`/user_login`, body);

    console.log("Login Response:", response.data);

    return response;
  } catch (error) {
    console.log("Login Error:", error);
    return error.response;
  }
};
export const checkUser = async (body) => {
  try {
    const response = await axios.post(`/user/check`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const rejisterUser = async (body) => {
  try {
    const response = await axios.post(`/addUser`, body);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const upload = async (body) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const response = await axios.post(`/upload`, body, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const deleteImage = async (body) => {
  try {
    const response = await axios.post(`/delteImage`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const update = async (id, body) => {
  try {
    const response = await axios.put(`/updateUser/${id}`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateAddressStatus = async (userId, addressId, isSelected) => {
  try {
    const response = await axios.put(
      `/update/user/status?userId=${userId}&addressId=${addressId}&isSelected=${isSelected}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const deleteAddress = async (userId, addressId) => {
  try {
    const response = await axios.delete(
      `/delete/user/status?userId=${userId}&addressId=${addressId}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const forgotPassword = async (body) => {
  try {
    const response = await axios.post(`/sendOtp`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const ResetPassword = async (body) => {
  try {
    const response = await axios.post(`/changePassword`, body);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDirections = async (originLat, originLng, destLat, destLng) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${googleApiKey}`
    );

    const route = response.data.routes[0];
    const distance = route.legs[0].distance.text; // Distance in textual format (e.g., "10 km")

    // You can also get the polyline points for drawing the route on the map
    const polylinePoints = route.overview_polyline.points;

    return { distance, polylinePoints };
  } catch (error) {
    console.error("Error getting directions:", error);
  }
};
