import axios from "../setup/axios";
const login =  (email, password) => {
  return  axios.post("/auth/login", {
    email: email,
    password: password,
  });
};
export { login };
