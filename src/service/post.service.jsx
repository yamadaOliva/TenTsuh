import axios from "../setup/axios";
const createPost = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/create", data);
};

const getPotsOfUser = (id, page, limit) => {
  return axios.get(`/post/get/user/${id}/${page}/${limit}`);
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

const createPostGroup = (data, access_token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post("/post/group", data);
};

const getPostGroup = (access_token, groupId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/post/group/${groupId}`);
};

const getGroupMemberOnline = (access_token, groupId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/friend/group/${groupId}/online`);
};

const getPostFollowing = (access_token, page, limit) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.get(`/post/following/${page}/${limit}`);
};

const deletePost = (access_token, postId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.delete(`/post/delete/${postId}`);
};

const deleteComment = (access_token, commentId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.delete(`/post/comment/delete/${commentId}`);
};

const createReport = (access_token, data) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  return axios.post(`/report/create`, data);
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
  createPostGroup,
  getPostGroup,
  getGroupMemberOnline,
  getPostFollowing,
  deletePost,
  deleteComment,
  createReport,
};
