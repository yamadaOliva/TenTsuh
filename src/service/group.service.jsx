import axios from "../setup/axios";
const createGroup = (accessToken, name) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.post("/group/create", { name });
};

const getGroup = (accessToken) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.get("/group/list");
};

const getRecommendGroup = (accessToken) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.get("/group/recommend");
};

const requestJoinGroup = (accessToken, groupId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.post("/group/join", { groupId });
};

const leaveGroup = (accessToken, groupId) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.post("/group/leave", { groupId });
};
export {
  createGroup,
  getGroup,
  getRecommendGroup,
  requestJoinGroup,
  leaveGroup,
};
