import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHome, FaList, FaUserFriends, FaBox, FaClipboardList, FaUsers, FaUserCircle, FaCreditCard, FaHistory, FaBoxOpen } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/role/${user?.email}`);
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        if (user?.email) {
            fetchUserRole();
        }
    }, [user]);

    const handleLogout = () => {
        logout()
            .then(() => {
                navigate('/');
            })
            .catch(error => console.log(error));
    };

    const employeeMenu = [
        { to: '/dashboard/my-assets', icon: <FaBox />, text: 'My Assets' },
        { to: '/dashboard/all-assets', icon: <FaBoxOpen />, text: 'Company Assets' },
        { to: '/dashboard/request-asset', icon: <FaClipboardList />, text: 'Request Asset' },
        { to: '/dashboard/my-team', icon: <FaUserFriends />, text: 'My Team' },
    ];

    const hrMenu = [
        { to: '/dashboard/asset-list', icon: <FaList />, text: 'Asset List' },
        { to: '/dashboard/add-asset', icon: <FaBox />, text: 'Add an Asset' },
        { to: '/dashboard/all-requests', icon: <FaClipboardList />, text: 'All Requests' },
        { to: '/dashboard/employee-list', icon: <FaUsers />, text: 'Employee List' },
    ];

    const commonMenu = [
        { to: '/dashboard/profile', icon: <FaUserCircle />, text: 'My Profile' },
        { to: '/dashboard/payment', icon: <FaCreditCard />, text: 'Payment' },
        { to: '/dashboard/payment-history', icon: <FaHistory />, text: 'Payment History' },
    ];

    const renderMenu = () => {
        const menuItems = userRole === 'hr' ? hrMenu : employeeMenu;
        return [...menuItems, ...commonMenu].map((item, index) => (
            <li key={index}>
                <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 
                        ${isActive ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' : 
                        'hover:bg-gray-100 dark:hover:bg-gray-800'} 
                        rounded-lg transition-colors duration-300`
                    }
                >
                    <span className="text-xl mr-3">{item.icon}</span>
                    {item.text}
                </NavLink>
            </li>
        ));
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
                <div className="p-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/xyz-logo.png" alt="XYZ Company" className="h-8" />
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">XYZ</span>
                    </Link>
                </div>
                <nav className="mt-8 px-4">
                    <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-300"
                    >
                        <FaHome className="text-xl mr-3" />
                        Home
                    </Link>
                    <ul className="mt-4 space-y-2">
                        {renderMenu()}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="flex items-center justify-end h-16 px-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300">{user?.displayName}</span>
                            <button
                                onClick={handleLogout}
                                className="btn-primary"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;