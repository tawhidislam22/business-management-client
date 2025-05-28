import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaList, FaPlus, FaUsers, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isHR } = useAdmin();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`)
        .then(res => {
          setCompany(res.data.company);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user, axiosSecure]);

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  const employeeMenuItems = [
    { to: '/dashboard/my-assets', icon: FaList, label: 'My Assets' },
    { to: '/dashboard/my-team', icon: FaUsers, label: 'My Team' },
    { to: '/dashboard/request-asset', icon: FaPlus, label: 'Request Asset' },
  ];

  const hrMenuItems = [
    { to: '/dashboard/asset-list', icon: FaList, label: 'Asset List' },
    { to: '/dashboard/add-asset', icon: FaPlus, label: 'Add Asset' },
    { to: '/dashboard/all-requests', icon: MdDashboard, label: 'All Requests' },
    { to: '/dashboard/employee-list', icon: FaUsers, label: 'Employee List' },
    { to: '/dashboard/add-employee', icon: FaUserPlus, label: 'Add Employee' },
  ];

  const menuItems = isHR ? hrMenuItems : employeeMenuItems;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Page content */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Company logo and info */}
          <div className="mb-8 text-center">
            {company?.logo ? (
              <img 
                src={company.logo} 
                alt={company.name} 
                className="w-32 mx-auto mb-2"
                onError={(e) => {
                  e.target.src = '/default-company-logo.png';
                }}
              />
            ) : (
              <img src="/xyz-logo.png" alt="XYZ Company" className="w-32 mx-auto mb-2" />
            )}
            <h2 className="text-xl font-semibold">{company?.name || 'XYZ Company'}</h2>
          </div>

          {/* Menu items */}
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2">
                <FaHome /> Home
              </Link>
            </li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.to} className="flex items-center gap-2">
                  <item.icon /> {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <img 
                  src={user?.photoURL || '/default-avatar.png'} 
                  alt={user?.displayName} 
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 