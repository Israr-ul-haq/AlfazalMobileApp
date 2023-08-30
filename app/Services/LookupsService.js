import axios from "../Constants/axios.config";

export const getLookups = async (id) => {
  try {
    const response = await axios.get(`/get/lookups/data?id=${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};
