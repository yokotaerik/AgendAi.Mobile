import axios from "axios";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

export const baseURL =
  Platform.OS == "android"
    ? "http://192.168.15.3:5000/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An error occurred.";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Erro tratado";
          break;
        default:
          errorMessage = "An unexpected error occurred.";
          break;
      }

      Toast.show({
        type: "error",
        text1: "Erro",
        text2: errorMessage,
        position: "bottom",
      });

      return Promise.reject({ ...error });
    }
  }
);

export interface ApiListResponse {
  items: Object[];
}

export default api;
