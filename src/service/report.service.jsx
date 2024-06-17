import axios from "../setup/axios";

const getReports = (accessToken, page, limit) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.get(`/report/list/${page}/${limit}`);
};

const deleteReport = (accessToken, id) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  return axios.delete(`/report/delete/${id}`);
};

export { getReports, deleteReport };
