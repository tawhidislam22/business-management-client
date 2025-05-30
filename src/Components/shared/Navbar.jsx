import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {renderMenuItems()}
          </ul>
        </div>
        <Link to="/" className="flex items-center">
          <img src="/xyz-logo.png" alt="XYZ Company" className="h-10" />
          <span className="text-xl font-bold ml-2">XYZ</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {renderMenuItems()}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL || '/default-avatar.png'} alt={user.displayName} />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/dashboard/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </div>
  );

  function renderMenuItems() {
    return (
      <>
        <li><Link to="/">Home</Link></li>
        {!user && (
          <>
            <li><Link to="/join-as-employee">Join as Employee</Link></li>
            <li><Link to="/join-as-hr">Join as HR</Link></li>
          </>
        )}
      </>
    );
  }
};

export default Navbar; 