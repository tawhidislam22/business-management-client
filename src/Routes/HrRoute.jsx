import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const HrRoute = ({ children }) => {
    const [isHr, isHrLoading] = useAdmin();
    const { user, loading } = useAuth();
    const location = useLocation();

    // Handle loading states
    if (loading || isHrLoading) {
        return <span className="loading loading-ring loading-lg"></span>;
    }

    // Handle authorization
    if (user && isHr) {
        return children;
    }

    // Redirect to login if unauthorized
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default HrRoute;
