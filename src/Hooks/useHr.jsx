import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useHr = () => {
    const { user } = useAuth(); // Get the user object
    const axiosSecure = useAxiosSecure();

    const { data: isHr = false, isLoading: isHrLoading, error } = useQuery({
        queryKey: ['isHr', user?.email], // Simplified queryKey
        enabled: !!user?.email, // Only run the query if user email exists
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/users/hr/${user.email}`);
                return res.data?.hr;
            } catch (err) {
                // Handle error (can log or show a message)
                console.error("Error fetching HR status:", err);
                throw new Error("Failed to fetch HR status");
            }
        },
    });

    // Optionally, handle the error state in the UI (like showing a message)
    if (error) {
        // Optionally handle the error state here
        console.error("Error loading HR data:", error);
    }

    return [isHr, isHrLoading, error];
};

export default useHr;
