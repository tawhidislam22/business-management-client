import { NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useHr from "../../Hooks/useHr";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [isHr, isHrLoading] = useHr();

    const handleSignOut = () => {
        logOut()
            .then(res => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    };

    const renderNavLinks = () => {
        if (!user) {
            return (
                <div className="flex justify-center items-center gap-4">
                    <NavLink className="mr-4" to="/login"><li>Login</li></NavLink>
                    <NavLink className="mr-4" to="/joinAsEmployee"><li>Join as Employee</li></NavLink>
                    <NavLink className="mr-4" to="/joinAsHr"><li>Join as HR Manager</li></NavLink>
                </div>
            );
        }

        if (isHr) {
            return (
                <div className="flex justify-center items-center gap-2">
                    <NavLink className="mr-4" to="/myAssets"><li>My Assets</li></NavLink>
                    <NavLink className="mr-4" to="/requestForAsset"><li>Request for an Asset</li></NavLink>
                    <NavLink className="mr-4" to="/myTeam"><li>My Team</li></NavLink>
                    <NavLink className="mr-4" to="/profile"><li>Profile</li></NavLink>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center gap-2">
                <NavLink className="mr-4" to="/assetList"><li>Asset List</li></NavLink>
                <NavLink className="mr-4" to="/addAnAsset"><li>Add An Asset</li></NavLink>
                <NavLink className="mr-4" to="/allRequests"><li>All Requests</li></NavLink>
                <NavLink className="mr-4" to="/myEmployeeList"><li>My Employee List</li></NavLink>
                <NavLink className="mr-4" to="/addAnEmployee"><li>Add an Employee</li></NavLink>
                <NavLink className="mr-4" to="/profile"><li>Profile</li></NavLink>
            </div>
        );
    };

    return (
        <div className="navbar bg-base-100">
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
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        {renderNavLinks()}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {renderNavLinks()}
                </ul>
            </div>
            <div className="navbar-end">
                {user && <button onClick={handleSignOut} aria-label="Sign Out">SignOut</button>}
            </div>
        </div>
    );
};

export default Navbar;
