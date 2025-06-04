import axios from "axios";
import { Alert, Platform } from "react-native";
import Toast from "react-native-toast-message";

export const baseURL =
  Platform.OS == "android"
    ? "http://192.168.30.172:5000/api"
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
          errorMessage = "Não foi possível concluir a solicitação. Certifique-se de que todos os dados estão válidos.";
          break;
        default:
          console.log(error.response);
          
          errorMessage = "Não foi possível concluir a solicitação. Certifique-se de que todos os dados estão válidos.";
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
