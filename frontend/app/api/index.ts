import axios from "axios";

const API_URL = "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  // autorise les cookies
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;