import axios from "axios";
import cookies from "js-cookie";
import nextCookies from "next-cookies";
import Router from "next/router";

const getAxios = (ctx?) => {
  const inst = axios.create();
  if (process.browser) {
    // for browser
    const name = cookies.get("name");
    const token = cookies.get("token");
    inst.defaults.headers.auth = `${name}:${token}`;
    // Add a response interceptor
    inst.interceptors.response.use((response) => {
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
  } else {
    // for server
    const { name, token  } = nextCookies(ctx);
    inst.defaults.headers.auth = `${name}:${token}`;
    inst.interceptors.response.use((response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          ctx.res.writeHead(302, { Location: "/auth/login" });
          ctx.res.end();
        }
      }
      return Promise.reject(error);
    });
  }
  return inst;
};

export { getAxios };
