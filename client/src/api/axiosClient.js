import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  }
});

// Thêm interceptor để tự động gắn token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")||sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi từ response
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API error:", error.response);
    throw error;
  }
);

export default axiosClient;
