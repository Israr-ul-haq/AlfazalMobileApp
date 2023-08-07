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

export const getById = async (id) => {
  try {
    const response = await axios.get(`/singleItem/${id}`);

    return response;
  } catch (error) {
    return error.response;
  }
};
