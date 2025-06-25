import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:50000",
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
