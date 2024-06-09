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

const changePassword = (accessToken, data) => {
  console.log(data);
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.post("/auth/change-password", data);
};

const forgotPassword = (email) => {
  return axios.post("/auth/forgot-password", { email });
};

const verifyForgotPassword = (token) => {
  return axios.post(`/auth/verify-forgot-password/`, {token});
};

const resetPassword = (token, password) => {
  const data = {
    password: password,
    token: token,
  };
  return axios.post(`/auth/reset-password`, data);
};
export {
  login,
  register,
  refreshToken,
  login365,
  logoutBE,
  activeAccount,
  changePassword,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
};
