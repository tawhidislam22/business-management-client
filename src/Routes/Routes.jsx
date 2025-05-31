import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorPage from '../Pages/ErrorPage';
import Home from '../pages/Home/Home';
import Login from '../Pages/LogIn/LogIn';
import JoinUser from '../Pages/Register/JoinUser';
import JoinAsHR from '../Pages/Auth/JoinAsHR';
import JoinAsEmployee from '../Pages/Auth/JoinAsEmployee';
import Dashboard from '../layouts/Dashboard';
import PrivateRoute from './PrivateRoute';
import MyAssets from '../Pages/Employee/MyAssets';
import RequestAsset from '../Pages/Employee/RequestAsset';
import MyTeam from '../Pages/Employee/MyTeam';
import AssetList from '../Pages/HR/AssetList';
import AddAsset from '../Pages/HR/AddAsset';
import AllRequests from '../Pages/HR/AllRequests';
import EmployeeList from '../Pages/HR/EmployeeList';
import Profile from '../Pages/Profile/Profile';
import Payment from '../Pages/Payment/Payment';
import PaymentHistory from '../Pages/PaymentHistory/PaymentHistory';
import AllAssets from '../Pages/AllAssets';

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
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <JoinUser />
            },
            {
                path: 'join-as-hr',
                element: <JoinAsHR />
            },
            {
                path: 'join-as-employee',
                element: <JoinAsEmployee />
            },
            {
                path: 'all-assets',
                element: (
                    <PrivateRoute>
                        <AllAssets />
                    </PrivateRoute>
                )
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
            // Employee routes
            {
                path: 'my-assets',
                element: <PrivateRoute><MyAssets /></PrivateRoute>
            },
            {
                path: 'request-asset',
                element: <PrivateRoute><RequestAsset /></PrivateRoute>
            },
            {
                path: 'my-team',
                element: <PrivateRoute><MyTeam /></PrivateRoute>
            },
            {
                path: 'all-assets',
                element: <PrivateRoute><AllAssets /></PrivateRoute>
            },  
            // HR routes
            {
                path: 'asset-list',
                element: <PrivateRoute><AssetList /></PrivateRoute>
            },
            {
                path: 'add-asset',
                element: <PrivateRoute><AddAsset /></PrivateRoute>
            },
            {
                path: 'all-requests',
                element: <PrivateRoute><AllRequests /></PrivateRoute>
            },
            {
                path: 'employee-list',
                element: <PrivateRoute><EmployeeList /></PrivateRoute>
            },
            // Common routes
            {
                path: 'profile',
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            {
                path: 'payment',
                element: <PrivateRoute><Payment /></PrivateRoute>
            },
            {
                path: 'payment-history',
                element: <PrivateRoute><PaymentHistory /></PrivateRoute>
            }
        ]
    }
]);

export default router;

