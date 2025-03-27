import axios from "axios";
import { Platform } from "react-native";



export const baseURL =
  Platform.OS == "android"
    ? "http://192.168.15.2:5000/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

export interface ApiListResponse {
  items: Object[]
}

export default api;
