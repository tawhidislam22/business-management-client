import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/xyz-logo.png" alt="XYZ Company" className="h-8 w-auto" />
              <span className="text-xl font-bold ml-2 text-primary-600 dark:text-primary-400">XYZ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            {!user && (
              <>
                <Link to="/join-as-employee" className="nav-link">Join as Employee</Link>
                <Link to="/join-as-hr" className="nav-link">Join as HR</Link>
              </>
            )}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <div className="relative group">
                  <button className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={user.photoURL || '/default-avatar.png'} 
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="nav-link block">Home</Link>
            {!user && (
              <>
                <Link to="/join-as-employee" className="nav-link block">Join as Employee</Link>
                <Link to="/join-as-hr" className="nav-link block">Join as HR</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 