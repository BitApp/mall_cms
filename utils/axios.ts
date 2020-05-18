import axios from "axios";
import cookies from "js-cookie";
import Router from "next/router";

axios.interceptors.request.use((config) => {
  const userName = cookies.get("name");
  const token = cookies.get("token");
  // Do something before request is sent
  config.headers = {
    auth: `${userName}:${token}`,
  };
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      Router.push("/auth/login");
    }
  }
  return Promise.reject(error);
});
export default axios;
