import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response, // Return response as-is if successful
      async (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
          // Handle Unauthorized or Forbidden
          try {
            await logOut(); // Log the user out
            localStorage.removeItem("access-token"); // Clear token from localStorage
            navigate("/login"); // Redirect to login page
          } catch (logoutError) {
            console.error("Error during logout:", logoutError.message);
          }
        } else if (status === 500) {
          console.error("Server Error: Something went wrong. Please try again later.");
        } else if (status >= 400 && status < 500) {
          console.error("Client Error: Please check your request.");
        }

        return Promise.reject(error); // Reject the error to handle it in calling functions
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
