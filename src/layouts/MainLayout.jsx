import { Link, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-xl font-bold">
                            Asset Management
                        </Link>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="hover:text-gray-300">
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={user.photoURL || 'https://via.placeholder.com/32'}
                                            alt={user.displayName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{user.displayName}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:text-gray-300"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-gray-300">
                                        Login
                                    </Link>
                                    <Link to="/register" className="hover:text-gray-300">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p>&copy; 2024 Asset Management. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <Toaster position="top-right" />
        </div>
    );
};

export default MainLayout; 