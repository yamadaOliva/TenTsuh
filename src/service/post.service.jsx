import axios from "../setup/axios";
const createPost = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/create", data);
};

const getPotsOfUser = (id) => {
  return axios.get(`/post/get/user/${id}`);
};

const likePost = (postId, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/post/like/`, { postId });
};

const unlikePost = (postId, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.delete(`/post/unlike/${postId}`);
};

const getPostById = (access_token, postId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/post/get/${postId}`);
};

const commentPost = (access_token, postId, content) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/post/comment`, { postId, content });
};

const replyComment = (access_token, commentId, content) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/post/comment/reply`, { commentId, content });
};

const likeComment = (access_token, commentId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/post/comment/like`, { commentId });
};

const unlikeComment = (access_token, commentId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.delete(`/post/comment/unlike/${commentId}`);
};

export {
  createPost,
  getPotsOfUser,
  likePost,
  unlikePost,
  getPostById,
  commentPost,
  replyComment,
  likeComment,
  unlikeComment,
};
