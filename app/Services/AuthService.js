import axios from "../Constants/axios.config";

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
