import axios from "../setup/axios";
const createPost = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/create", data);
};

const getPotsOfUser = (access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get("/post/get");
};

export { createPost, getPotsOfUser };
