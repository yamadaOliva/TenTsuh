import axios from "../setup/axios";
const createPost = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/create", data);
};

const getPotsOfUser = (id) => {
  return axios.get(`/post/get/${id}`);
};

const likePost = (postId, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/post/like/`, { postId });
};

const unlikePost = (postId, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.delete(`/post/unlike/${postId}`);
};
export { createPost, getPotsOfUser, likePost, unlikePost };
