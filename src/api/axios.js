import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { navigate } from "../helper/navigate";
const BASE_URL = process.env.REACT_APP_API_URL;
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;
// create instance
const api = axios.create({
  baseURL: BASE_URL,
  //withCredentials: true, // important for cookie refresh token
});
// Add request interceptor

api.interceptors.request.use(
  async (config) => {
    // const token = getAccessToken();
    let lang = localStorage.getItem("lang");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;
    // config.headers["Content-Type"] = "application/json";
    config.headers["Accept-Language"] = lang;
    if (config.isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    if (config.responseType) {
      config.responseType = "blob"; // default or custom type like 'blob'
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      //window.location.href = "/login";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];
// When multiple API requests fail at the same time (access token expired),
// we don’t want to refresh the token multiple times — just once,
// and queue the others until it’s done.
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
// Add response interceptor

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // ✅ Queue other 401 requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const user = JSON.parse(localStorage.getItem("user"));
      const oldAccessToken = user?.accessToken;
      const oldRefreshToken = user?.refreshToken;
      try {
        const refreshResponse = await axios.post(BASE_URL_AUTH + "/refresh", {
          AccessToken: oldAccessToken,
          RefreshToken: oldRefreshToken,
        });

        console.log("refreshResponse ", refreshResponse);
        const newToken = refreshResponse?.data?.user?.accessToken;
        const newRefesh = refreshResponse?.data?.user?.refreshToken;
        localStorage.setItem(
          "user",
          JSON.stringify(refreshResponse?.data?.user)
        );
        // localStorage.setItem("token", newToken);
        // localStorage.setItem("RefreshToken", newRefresh);
        // ✅ Apply tro axios defaults for next requests
        api.defaults.headers.Authorization = `Bearer ${newToken}`;

        // ✅ Process queued requests with new token
        processQueue(null, newToken);

        // ✅ Retry the failed request
        return api(originalRequest);
      } catch (err) {
        // ❌ Refresh failed — clear everything and logout
        processQueue(err, null);
        localStorage.removeItem("user");
        // localStorage.removeItem("token");
        // localStorage.removeItem("RefreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
