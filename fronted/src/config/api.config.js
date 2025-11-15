// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiConfig = {
  baseURL: `${API_BASE_URL}/api/questions`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export default API_BASE_URL;
