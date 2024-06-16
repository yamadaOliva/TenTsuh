import axios from "../setup/axios";

const getMe = (access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/user/me");
};

const getProfile = (access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/user/profile");
};

const getProfileById = (access_token, id) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/user/profile/${id}`);
};

const updateProfile = (access_token, data) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.put("/user/profile", data);
};

const getListUser = (access_token, page, limit) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/user/list/${page}/${limit}`);
};

const banUser = (access_token, id) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.put(`/user/ban/${id}`);
};

const unbanUser = (access_token, id) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.put(`/user/unban/${id}`);
};

const searchUser = (access_token, name, field, page, limit) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/user/search/${name}/${field}/${page}/${limit}`);
};
export {
  getMe,
  getProfile,
  updateProfile,
  getProfileById,
  getListUser,
  banUser,
  unbanUser,
  searchUser,
};
