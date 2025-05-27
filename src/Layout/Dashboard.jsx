import { NavLink, Outlet } from "react-router-dom";
import useHr from "../Hooks/useHr";
import { FaHome } from "react-icons/fa";

const Dashboard = () => {
    const [isHr] = useHr();
    return (
        <div className="flex">
            <div className="w-64 min-h-screen bg-orange-400">
                <ul className="menu p-4">
                    {
                        !isHr ? <>
                            <li><NavLink to="/dashboard/myAssets" className="text-white hover:bg-orange-500 mb-2">My Assets</NavLink></li>
                            <li><NavLink to="/dashboard/requestForAsset" className="text-white hover:bg-orange-500 mb-2">Request for an Asset</NavLink></li>
                            <li><NavLink to="/dashboard/myTeam" className="text-white hover:bg-orange-500 mb-2">My Team</NavLink></li>
                            <li><NavLink to="/dashboard/profile" className="text-white hover:bg-orange-500 mb-2">Profile</NavLink></li>
                        </> : <>
                            <li><NavLink to="/dashboard/assetList" className="text-white hover:bg-orange-500 mb-2">Asset List</NavLink></li>
                            <li><NavLink to="/dashboard/addAnAsset" className="text-white hover:bg-orange-500 mb-2">Add An Asset</NavLink></li>
                            <li><NavLink to="/dashboard/allRequests" className="text-white hover:bg-orange-500 mb-2">All Requests</NavLink></li>
                            <li><NavLink to="/dashboard/myEmployeeList" className="text-white hover:bg-orange-500 mb-2">My Employee List</NavLink></li>
                            <li><NavLink to="/dashboard/addAnEmployee" className="text-white hover:bg-orange-500 mb-2">Add an Employee</NavLink></li>
                            <li><NavLink to="/dashboard/profile" className="text-white hover:bg-orange-500 mb-2">Profile</NavLink></li>
                        </>
                    }
                    <div className="divider bg-orange-500"></div>
                    <li>
                        <NavLink to="/" className="text-white hover:bg-orange-500">
                            <FaHome className="text-xl" /> Home
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="flex-1 p-8">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;