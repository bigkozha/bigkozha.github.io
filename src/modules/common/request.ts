import { notification } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { generateJwt } from "./jwtHelper";

const axiosApi = (): AxiosInstance => {
  const options = {
    headers: {
      "Content-type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  };

  const instance = axios.create(options);

  instance.interceptors.request.use(
    async function (config: AxiosRequestConfig) {
      await document.execCommand("ClearAuthenticationCache", false);
      const token = await generateJwt();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      notification.error({
        message: `Request error: ${error.config.url}. Status code: ${error.response.status}`,
        description: error.toString(),
      });

      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 400) {
        console.log("error", error);
        notification.error({
          message: `Error`,
          description:
            error.response.data.errors === undefined
              ? error.response.data.Message
              : error.response.data.errors.join(", "),
        });
      } else if (error.response.status === 403) {
        window.location.href = "#/Forbidden";
        notification.error({
          message: `Forbidden`,
          description: error.response.data.Message,
        });
      } else if (error.response.status === 404) {
        window.location.href = "#/NotFound";
        notification.error({
          message: `Page not found`,
          description: error.response.data.Message,
        });
      } else {
        window.location.href = "#/Error";
        notification.error({
          message: `Error`,
          description: error.response.data.Message,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosApi();
