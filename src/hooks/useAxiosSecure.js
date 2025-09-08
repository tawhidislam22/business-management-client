import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from './useAuth';
import axiosSecure from '../config/axios.config';

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor - cookies are handled automatically
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Cookies are automatically sent with requests when withCredentials is true
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          await logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure; 