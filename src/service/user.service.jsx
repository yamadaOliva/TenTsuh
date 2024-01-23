import axios from "../setup/axios";

const getMe = (access_token) => {
  //set header
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/user/me");
};
export { getMe };
