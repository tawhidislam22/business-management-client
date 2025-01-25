import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000", // Using environment variable for the base URL
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  // Adding token to headers for every request
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Handling responses and authentication errors
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response?.status;

      // Handling 401 or 403 errors (Unauthorized or Forbidden)
      if (status === 401 || status === 403) {
        // Attempt to refresh the token or log out
        await logOut();
        navigate("/login");
      }

      // Log the error or notify the user
      console.error("API error:", error.message);

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
