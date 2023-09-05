import axios from "../Constants/axios.config";

export const get = async (pageNumber, pageSize, search, userId) => {
  try {
    const response = await axios.get(
      `/listItemsByUserId?page=${pageNumber}&limit=${pageSize}&search=${search}&userId=${userId}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getCategories = async (page, limit, search) => {
  try {
    const response = await axios.get(
      `/get/category/data?page=${page}&limit=${limit}&search=${search}`
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getById = async (id) => {
  try {
    const response = await axios.get(`/singleItem/${id}`);

    return response;
  } catch (error) {
    return error.response;
  }
};
