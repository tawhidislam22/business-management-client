import { Link, NavLink, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaHome, FaList, FaUserPlus, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import { MdAddBox, MdRequestPage } from 'react-icons/md';

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
                <div className="mb-8">
                    <Link to="/" className="text-2xl font-bold">Asset Management</Link>
                </div>
                
                <ul className="space-y-2">
                    {isAdmin ? (
                        <>
                            <li>
                                <NavLink to="/dashboard/asset-list" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <FaList /> Asset List
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/add-asset" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <MdAddBox /> Add Asset
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/all-requests" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <FaClipboardList /> All Requests
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/custom-requests" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <MdRequestPage /> Custom Requests
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/employee-list" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <FaUserPlus /> Employee List
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/dashboard/my-assets" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <FaList /> My Assets
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/request-asset" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <MdRequestPage /> Request Asset
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/my-team" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                                    <MdAddBox /> My Team
                                </NavLink>
                            </li>
                        </>
                    )}
                    
                    {/* Common routes */}
                    <div className="divider"></div>
                    <li>
                        <NavLink to="/dashboard/profile" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                            <FaUserCircle /> My Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                            <FaHome /> Home
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard; 