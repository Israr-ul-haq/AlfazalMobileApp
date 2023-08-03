import axios from "../Constants/axios.config";

export const get = async (pageNumber, pageSize, search) => {
  try {
    const response = await axios.get(
      `/listItems?page=${pageNumber}&limit=${pageSize}&search=${search}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
