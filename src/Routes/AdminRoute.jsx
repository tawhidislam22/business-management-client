import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import { ThreeDots } from 'react-loader-spinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { isHR, isHRLoading } = useAdmin();
  const location = useLocation();

  if (loading || isHRLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (user && isHR) {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AdminRoute; 