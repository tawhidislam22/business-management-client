import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useAdmin = () => {
  const { user, loading } = useAuth();
  const [isHR, setIsHR] = useState(false);
  const [isHRLoading, setIsHRLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const checkHRRole = async () => {
      try {
        if (user?.email) {
          const res = await axiosSecure.get(`/users/role/${user.email}`);
          setIsHR(res.data.role === 'hr');
        }
      } catch (error) {
        console.error('Error checking HR role:', error);
        setIsHR(false);
      } finally {
        setIsHRLoading(false);
      }
    };

    if (!loading) {
      checkHRRole();
    }
  }, [user, loading, axiosSecure]);

  return { isHR, isHRLoading };
};

export default useAdmin; 