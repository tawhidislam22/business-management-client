import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";


const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  // Request Interceptor: Add token to headers
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      console.log("Request sent:", config.url); // Log request URL
      return config;
    },
    function (error) {
      console.error("Request error:", error.message); // Log request error
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Handle API responses and errors
  axiosSecure.interceptors.response.use(
    function (response) {
      console.log("Response received:", response.config.url); // Log response URL
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      console.error("API error:", error.message); // Log API error
      console.error("Status code:", status); // Log status code

      // Handle 401 and 403 errors (Unauthorized or Forbidden)
      if (status === 401 || status === 403) {
        // Attempt to refresh token if 401 is due to token expiry
        const refreshToken = localStorage.getItem("refresh-token");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(`${import.meta.env.VITE_API_URL}/refresh-token`, {
              refreshToken,
            });
            const newToken = refreshResponse.data.token;
            localStorage.setItem("access-token", newToken);

            // Retry the original request with the new token
            error.config.headers.authorization = `Bearer ${newToken}`;
            return axiosSecure(error.config);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError.message);
          }
        }

        // If token refresh fails or no refresh token, log out user
        await logOut();
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        navigate("/login");
      }

      // Handle other status codes
      if (status === 500) {
        //toast.error("Server Error, try again later.");
      } else if (status >= 400 && status < 500) {
        //toast.error("Client Error, please check your request.");
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;