import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "https://app.cargocloset.com",
  headers: {
    "Content-Type": "application/json", // Set the default Content-Type header if needed
  },
});

export default instance;

export const baseURL = "https://54.164.24.167/";

export const googleApiKey = "AIzaSyDZ1JewDo9hZTh-b73EK7h7zks4wO0_gMM";
export const lookupsId = "64e7535b8f66a2f57840d377";
