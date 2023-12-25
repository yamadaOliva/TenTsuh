import axios from "axios";
import { toast } from "react-toastify";
const instance = axios.create({
  baseURL: "http://localhost:8080",
});
instance.defaults.withCredentials = true;
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : 500;
    switch (status) {
      case 401:
        toast.error("Unauthorized");
        break;
      case 403:
        toast.error("Forbidden");
        break;
      case 404:
        toast.error("Not Found");
        break;
      case 500:
        toast.error("Internal Server Error");
        break;
      default:
        toast.error("Unknown Error");
    }
  }
);
