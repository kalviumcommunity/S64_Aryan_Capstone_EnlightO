import axios from "axios";

// Automatically detect environment and use appropriate backend URL
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost 
  ? "http://localhost:50000" 
  : "https://s64-aryan-capstone-enlighto.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken") || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized response
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth");
      window.location.href = "/auth"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
