import axios from "../setup/axios";

const getMe = (access_token) => {
  //set header
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/user/me");
};

const getProfile = (access_token) => {
  //set header
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/user/profile");
};

const getProfileById = (access_token, id) => {
  //set header
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/user/profile/${id}`);
};

const updateProfile = (access_token, data) => {
  //set header
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.put("/user/profile", data);
};
export { getMe, getProfile, updateProfile, getProfileById };
