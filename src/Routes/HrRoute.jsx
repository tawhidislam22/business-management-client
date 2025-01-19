import { Navigate } from "react-router-dom";
import useAdmin from "../Hooks/useAdmin";
import useAuth from "../Hooks/useAuth";


const HrRoute = ({children}) => {
    const [isHr,isHrLoading]=useAdmin()
    const {user,loading}=useAuth()
    if(loading || isHrLoading){
        return <span className="loading loading-ring loading-lg"></span>;
    }
    if(user && isHr){
        return children
    }
    return <Navigate to="/login" state={{from:location}} replace></Navigate>;
};

export default HrRoute;