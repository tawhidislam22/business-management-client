import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useNavigate } from "react-router-dom";

const useHr = (debug = false) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: isHr = false,
    isLoading: isHrLoading,
    error,
  } = useQuery({
    queryKey: ["isHr", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      if (debug) {
        console.log("Fetching HR status for user:", user?.email);
      }

      try {
        const res = await axiosSecure.get(`/users/hr/${user.email}`);
        if (debug) {
          console.log("HR status response:", res.data);
        }
        return res.data?.hr;
      } catch (err) {
        console.error("Error fetching HR status:", err);
        throw new Error(
          err.response?.data?.message || "Failed to fetch HR status"
        );
      }
    },
    onError: (err) => {
      if (debug) {
        console.error("Error loading HR data:", err.message);
      }

      // Handle 401 and 403 errors (Unauthorized or Forbidden)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem("access-token");
        navigate("/login");
      }
    },
  });

  // Combine loading states for HR data and user email availability
  const isLoading = isHrLoading || !user?.email;

  // Return as an object for better usability
  return [ isHr, isLoading, error ];
};

export default useHr;
