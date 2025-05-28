import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
//import { Helmet } from 'react-helmet-async';
//import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
//import { Pie } from 'react-chartjs-2';

//ChartJS.register(ArcElement, Tooltip, Legend);

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    memberLimit: 5,
    price: 5,
    features: [
      'Up to 5 team members',
      'Basic asset tracking',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    memberLimit: 10,
    price: 8,
    features: [
      'Up to 10 team members',
      'Advanced asset tracking',
      'Priority email support',
      'Detailed analytics',
      'Custom reports'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    memberLimit: 20,
    price: 15,
    features: [
      'Up to 20 team members',
      'Premium asset tracking',
      '24/7 phone support',
      'Advanced analytics',
      'Custom reports',
      'API access'
    ]
  }
];

const Home = () => {
  const { user } = useAuth();
  const { isHR } = useAdmin();
  const axiosSecure = useAxiosSecure();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch data for HR dashboard
  const { data: hrDashboardData = {} } = useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: async () => {
      if (!user || !isHR) return {};
      const res = await axiosSecure.get('/dashboard/hr-stats');
      return res.data;
    },
    enabled: !!user && isHR
  });

  // Fetch data for employee dashboard
  const { data: employeeDashboardData = {} } = useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: async () => {
      if (!user || isHR) return {};
      const res = await axiosSecure.get('/dashboard/employee-stats');
      return res.data;
    },
    enabled: !!user && !isHR
  });

  // Auto-advance slider
  useEffect(() => {
    if (!user) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 2);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [user]);

  // Prepare chart data for HR dashboard
  // const chartData = {
  //   labels: ['Returnable Items', 'Non-returnable Items'],
  //   datasets: [
  //     {
  //       data: [
  //         hrDashboardData.returnablePercentage || 0,
  //         hrDashboardData.nonReturnablePercentage || 0
  //       ],
  //       backgroundColor: ['#4ade80', '#f87171'],
  //       borderColor: ['#22c55e', '#ef4444'],
  //       borderWidth: 1
  //     }
  //   ]
  // };

  if (!user) {
    return (
      <>
        {/* <Helmet>
          <title>XYZ Asset Management - Home</title>
        </Helmet> */}

        {/* Hero Section with Slider */}
        <div className="relative h-[600px] overflow-hidden">
          <div
            className="absolute w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* HR Slide */}
            <div className="absolute w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h1 className="text-5xl font-bold mb-6">Manage Your Business Assets</h1>
                <p className="text-xl mb-8">Join as an HR Manager and take control of your company's assets</p>
                <Link to="/join-as-hr" className="btn btn-primary btn-lg">
                  Join as HR Manager
                </Link>
              </div>
            </div>

            {/* Employee Slide */}
            <div className="absolute w-full h-full translate-x-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h1 className="text-5xl font-bold mb-6">Join Your Team</h1>
                <p className="text-xl mb-8">Connect with your company and manage your assets efficiently</p>
                <Link to="/join-as-employee" className="btn btn-primary btn-lg">
                  Join as Employee
                </Link>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* About Section */}
        <section className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">About Our Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Asset Management</h3>
                  <p>Efficiently track and manage all your company assets in one place.</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Team Collaboration</h3>
                  <p>Foster better team coordination with our collaborative features.</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Analytics & Insights</h3>
                  <p>Make data-driven decisions with our comprehensive analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body">
                    <h3 className="card-title justify-center text-2xl">{pkg.name}</h3>
                    <div className="text-center my-4">
                      <span className="text-4xl font-bold">${pkg.price}</span>
                      <span className="text-base-content/60">/month</span>
                    </div>
                    <div className="divider"></div>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="card-actions justify-center mt-6">
                      <Link to="/join-as-hr" className="btn btn-primary btn-block">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (isHR) {
    return (
      <>
        {/* <Helmet>
          <title>HR Dashboard - Home</title>
        </Helmet> */}

        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Pending Requests</div>
              <div className="stat-value">{hrDashboardData.pendingRequests || 0}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Total Assets</div>
              <div className="stat-value">{hrDashboardData.totalAssets || 0}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Low Stock Items</div>
              <div className="stat-value text-warning">{hrDashboardData.lowStockItems || 0}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Total Employees</div>
              <div className="stat-value">{hrDashboardData.totalEmployees || 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Requests */}
            <div className="bg-base-100 shadow rounded-box p-6">
              <h3 className="text-xl font-bold mb-4">Recent Requests</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Employee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrDashboardData.recentRequests?.map((request) => (
                      <tr key={request._id}>
                        <td>{request.asset.name}</td>
                        <td>{request.requester.name}</td>
                        <td>
                          <span className={`badge badge-${
                            request.status === 'pending' ? 'warning' :
                            request.status === 'approved' ? 'success' :
                            'error'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/all-requests" className="btn btn-primary btn-sm">
                  View All Requests
                </Link>
              </div>
            </div>

            {/* Asset Distribution */}
            <div className="bg-base-100 shadow rounded-box p-6">
              <h3 className="text-xl font-bold mb-4">Asset Distribution</h3>
              <div className="w-full max-w-md mx-auto">
                {/* <Pie data={chartData} /> */}
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="bg-base-100 shadow rounded-box p-6">
              <h3 className="text-xl font-bold mb-4">Low Stock Items</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrDashboardData.lowStockItems?.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <span className="badge badge-warning">Low Stock</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Most Requested Items */}
            <div className="bg-base-100 shadow rounded-box p-6">
              <h3 className="text-xl font-bold mb-4">Most Requested Items</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Requests</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrDashboardData.mostRequestedItems?.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.requestCount}</td>
                        <td>
                          <span className="badge badge-ghost">{item.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <Helmet>
        <title>Employee Dashboard - Home</title>
      </Helmet> */}

      <div className="container mx-auto px-4 py-8">
        {employeeDashboardData.hasCompany ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">My Assets</div>
                <div className="stat-value">{employeeDashboardData.totalAssets || 0}</div>
              </div>
              <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Pending Requests</div>
                <div className="stat-value">{employeeDashboardData.pendingRequests || 0}</div>
              </div>
              <div className="stat bg-base-100 shadow rounded-box">
                <div className="stat-title">Monthly Requests</div>
                <div className="stat-value">{employeeDashboardData.monthlyRequests || 0}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pending Requests */}
              <div className="bg-base-100 shadow rounded-box p-6">
                <h3 className="text-xl font-bold mb-4">My Pending Requests</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Request Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeDashboardData.pendingRequestsList?.map((request) => (
                        <tr key={request._id}>
                          <td>{request.asset.name}</td>
                          <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                          <td>
                            <span className="badge badge-warning">Pending</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Requests */}
              <div className="bg-base-100 shadow rounded-box p-6">
                <h3 className="text-xl font-bold mb-4">Monthly Request History</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Request Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeDashboardData.monthlyRequestsList?.map((request) => (
                        <tr key={request._id}>
                          <td>{request.asset.name}</td>
                          <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge badge-${
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'error' :
                              'warning'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom Sections (Calendar, Events, Notice) */}
              <div className="bg-base-100 shadow rounded-box p-6">
                <h3 className="text-xl font-bold mb-4">Company Calendar</h3>
                {/* Add your calendar component here */}
              </div>

              <div className="bg-base-100 shadow rounded-box p-6">
                <h3 className="text-xl font-bold mb-4">Company Notices</h3>
                <div className="space-y-4">
                  {employeeDashboardData.notices?.map((notice) => (
                    <div key={notice._id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{notice.title}</h4>
                        <p>{notice.content}</p>
                        <div className="text-sm text-base-content/60">
                          {new Date(notice.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Welcome to XYZ Asset Management</h2>
            <p className="text-lg mb-8">Please contact your HR manager to get affiliated with your company.</p>
            <div className="max-w-md mx-auto bg-base-200 p-6 rounded-box">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p>If you're having trouble getting connected, please reach out to our support team.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;