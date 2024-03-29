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
  return axios.post("/auth/refresh-token", {
    refresh_token: refresh_token,
  });
};
export { login, register, refreshToken };
