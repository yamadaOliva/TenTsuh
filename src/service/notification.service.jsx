import axios from "../setup/axios";

const getNotifications = (accessToken, page, limit) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.get(`/notification/list/${page}/${limit}`);
};

const readNotification = (accessToken) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.put(`/notification/read`);
};

const deleteNotification = (accessToken, id) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.delete(`/notification/delete/${id}`);
};
export { getNotifications, readNotification, deleteNotification };
