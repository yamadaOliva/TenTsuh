import axios from "axios";
import { toast } from "react-toastify";
const instance = axios.create({
  baseURL: "https://basenestjs-restful-production.up.railway.app",
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
        break;
      case 403:
        break;
      case 404:
        toast.error("Không tìm thấy trang");
        break;
      case 500:
        toast.error("Mất kết nối đến server");
        break;
      default:
    }
  }
);
export default instance;
