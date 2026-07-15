import axios from "axios";

// Read backend URL from Vite environment
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("=================================");
console.log("🌐 Backend URL:", BASE_URL);
console.log("=================================");

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🚀 Request:", {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Responses
API.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received");
    } else {
      console.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
