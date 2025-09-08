import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaHome, FaList, FaUserFriends, FaBox, FaClipboardList, FaUsers, FaUserCircle, FaCreditCard, FaHistory, FaBoxOpen, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch user data including role
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        }
    });

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const userRole = userData?.role;

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
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-300 group
                        ${isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105'
                        }`
                    }
                >
                    <span className={`text-xl mr-3 transition-transform duration-300 ${isActive ? 'transform rotate-12' : 'group-hover:transform group-hover:rotate-12'}`}>
                        {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                </NavLink>
            </li>
        ));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile Menu Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                shadow-2xl
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <FaBox className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    Asset Manager
                                </h1>
                                <p className="text-xs text-gray-400 capitalize">
                                    {userRole || 'User'} Dashboard
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors p-2"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            {user?.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="text-white text-2xl" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 overflow-y-auto">
                    <ul className="space-y-1">
                        {renderMenu()}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-6 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300 group"
                    >
                        <FaSignOutAlt className="text-xl mr-3 group-hover:transform group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-lg border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <FaBars className="text-xl" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
                            </h2>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-700 font-medium capitalize">
                                    {userRole || 'Loading...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[calc(100vh-12rem)]">
                            <div className="p-6">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;