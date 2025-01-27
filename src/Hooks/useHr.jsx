import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useNavigate } from "react-router-dom"; // Import react-router-dom for navigation

const useHr = () => {
    const { user } = useAuth(); // Get the user object
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Hook to navigate to login or error pages if needed

    const { data: isHr = false, isLoading: isHrLoading, error } = useQuery({
        queryKey: ['isHr', user?.email], // Simplified queryKey
        enabled: !!user?.email, // Only run the query if user email exists
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/users/hr/${user.email}`);
                return res.data?.hr;
            } catch (err) {
                // Handle error (Unauthorized, network errors, etc.)
                console.error("Error fetching HR status:", err);

                // Handle 401 Unauthorized error
                if (err.response && err.response.status === 401) {
                    navigate('/login'); // Redirect to login page if unauthorized
                }

                throw new Error("Failed to fetch HR status");
            }
        },
    });

    // Optionally, handle the error state in the UI (like showing a message)
    if (error) {
        // You might want to display an error message or notification here
        console.error("Error loading HR data:", error);
    }

    return [isHr, isHrLoading, error];
};

export default useHr;
