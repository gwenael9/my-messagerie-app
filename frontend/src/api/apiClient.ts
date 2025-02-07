import axios from "axios";

const API_URl = process.env.NEXT_PUBLIC_API_SERVER;

const apiClient = axios.create({
  baseURL: API_URl,
  withCredentials: true,
});

export default apiClient;
