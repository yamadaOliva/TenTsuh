import axios from "../setup/axios";
const getMajor = () => {
  return axios.get("/major/getAll");
};
export { getMajor };
