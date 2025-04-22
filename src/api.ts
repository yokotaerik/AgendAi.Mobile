import axios from "axios";
import { Alert, Platform } from "react-native";
import Toast from "react-native-toast-message";

export const baseURL =
  Platform.OS == "android"
    ? "http://192.168.89.172:5000/api"
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
    console.log(error);
    let errorMessage = "An error occurred.";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "Erro tratado";
          break;
        default:
          console.log(error.response);
          
          errorMessage = "An unexpected error occurred.";
          break;
      }


      Alert.alert("Error", errorMessage);
      return Promise.reject({ ...error });
    }
  }
);

export interface ApiListResponse {
  items: Object[];
}

export default api;
