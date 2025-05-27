import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useHr from "../../Hooks/useHr";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [isHr] = useHr();

    const handleSignOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Successfully logged out",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(err => {
                console.log(err.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to log out. Please try again.",
                });
            });
    };

    const navLinks = (
        <>
            <li><NavLink to="/" className={({ isActive }) => 
                isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
            }>Home</NavLink></li>
            
            {user ? (
                <>
                    <li><NavLink to="/dashboard" className={({ isActive }) => 
                        isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                    }>Dashboard</NavLink></li>
                    
                    {isHr && (
                        <li><NavLink to="/dashboard/assetList" className={({ isActive }) => 
                            isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                        }>Asset List</NavLink></li>
                    )}
                </>
            ) : (
                <>
                    <li><NavLink to="/login" className={({ isActive }) => 
                        isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                    }>Login</NavLink></li>
                    <li><NavLink to="/joinAsEmployee" className={({ isActive }) => 
                        isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                    }>Join as Employee</NavLink></li>
                    <li><NavLink to="/joinAsHr" className={({ isActive }) => 
                        isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500"
                    }>Join as HR</NavLink></li>
                </>
            )}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/" className="text-xl font-bold text-orange-500">
                    BAM System
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navLinks}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            {user.photoURL ? (
                                <div className="w-10 rounded-full">
                                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                                </div>
                            ) : (
                                <FaUserCircle className="w-8 h-8 text-gray-600" />
                            )}
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="px-4 py-2 text-sm text-gray-700">
                                {user.displayName || 'User'}
                            </li>
                            <div className="divider my-0"></div>
                            <li>
                                <Link to="/dashboard/profile" className="text-sm">Profile</Link>
                            </li>
                            <li>
                                <button onClick={handleSignOut} className="text-sm text-red-500">
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-sm btn-outline btn-orange-500">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
