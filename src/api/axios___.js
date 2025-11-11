// src/api/axios.js
import axios from "axios";
//import { store } from "../redux/store"; // your redux store
// import { useNavigate } from "react-router-dom";
import { navigate } from "../helper/navigate";
const BASE_URL = process.env.REACT_APP_API_URL;
// create instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // dispatch logout
      //store.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // redirect to login
      navigate("/login");
      //window.location.href = "/login"; // or use navigate if inside a component
    }
    if (!error.response) {
      // console.error("Network error or server not reachable");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // redirect to login
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
