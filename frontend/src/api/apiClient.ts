import axios from "axios";

const API_URl = "http://localhost:4000";

const apiClient = axios.create({
  baseURL: API_URl,
  withCredentials: true,
});

export default apiClient;
