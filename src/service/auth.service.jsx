import { Token } from "@mui/icons-material";
import axios from "../setup/axios";
const login = (email, password) => {
  console.log(email, password);
  return axios.post("/auth/login", {
    email: email,
    password: password,
  });
};
const register = (data) => {
  return axios.post("/auth/register", data);
};
const refreshToken = (refresh_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${refresh_token}`;
  return axios.post("/auth/refreshToken");
};

const login365 = (data) => {
  return axios.post("/auth/office365", data);
};

const logoutBE = (accessToken) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.put("/auth/logout");
};

const activeAccount = (token) => {
  return axios.get(`/auth/active/${token}`);
};
export { login, register, refreshToken, login365, logoutBE, activeAccount };
