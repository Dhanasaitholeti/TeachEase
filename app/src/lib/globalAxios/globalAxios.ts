import axios from "axios";
import { toast } from "react-toastify";

export const createAxiosInstance = (baseURL?: string) => {
  const axiosInstance = axios.create({
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error(error.message);
          window.location.href = "/login";
        }
      }
      return Promise.reject(
        error.response ? error.response.data : error.message
      );
    }
  );

  return axiosInstance;
};

// Default export uses the environment variable
const globalAxios = createAxiosInstance();
export default globalAxios;
