import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "http://192.168.0.1:4015",
  headers: {
    "Content-Type": "application/json", // Set the default Content-Type header if needed
  },
});

export default instance;

export const baseURL = "http://192.168.0.1:4015/";
