import axios from "../setup/axios";
const createPost = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/create", data);
};

const getPotsOfUser = (id) => {
  return axios.get(`/post/get/${id}`);
};

export { createPost, getPotsOfUser };
