import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Auth/Login';
import JoinAsEmployee from '../Pages/Auth/JoinAsEmployee';
import JoinAsHR from '../Pages/Auth/JoinAsHR';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import MyAssets from '../Pages/MyAssets/MyAssets';
import MyTeam from '../Pages/MyTeam/MyTeam';
import RequestAsset from '../Pages/RequestForAsset/RequestAssetPage';
import Profile from '../Pages/Profile/Profile';
import AssetList from '../Pages/AssetList/AssetList';
import AddAsset from '../Pages/AddAnAsset/AddAnAsset';
import AllRequests from '../Pages/AllRequests/AllRequests';
import EmployeeList from '../Pages/MyEmployeeList/MyEmployeeList';
import AddEmployee from '../Pages/AddAnEmployee/AddAnEmployee';
import Payment from '../Pages/Payment/Payment';
import ErrorPage from '../Pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/join-as-employee',
        element: <JoinAsEmployee />
      },
      {
        path: '/join-as-hr',
        element: <JoinAsHR />
      },
      {
        path: '/payment',
        element: <PrivateRoute><Payment /></PrivateRoute>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: 'my-assets',
        element: <MyAssets />
      },
      {
        path: 'my-team',
        element: <MyTeam />
      },
      {
        path: 'request-asset',
        element: <RequestAsset />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'asset-list',
        element: <AdminRoute><AssetList /></AdminRoute>
      },
      {
        path: 'add-asset',
        element: <AdminRoute><AddAsset /></AdminRoute>
      },
      {
        path: 'all-requests',
        element: <AdminRoute><AllRequests /></AdminRoute>
      },
      {
        path: 'employee-list',
        element: <AdminRoute><EmployeeList /></AdminRoute>
      },
      {
        path: 'add-employee',
        element: <AdminRoute><AddEmployee /></AdminRoute>
      }
    ]
  }
]);

export default router;

