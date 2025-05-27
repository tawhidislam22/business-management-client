import {
    createBrowserRouter,
    
  } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import LogIn from "../Pages/LogIn/LogIn";
import Home from "../Pages/Home/Home";
import JoinAsEmployee from "../Pages/Register/JoinAsEmployee";
import JoinAsHRManager from "../Pages/Register/JoinAsHRManager";
import MyAssets from "../Pages/MyAssets/MyAssets";
import RequestAssetPage from "../Pages/RequestForAsset/RequestAssetPage";
import Profile from "../Pages/Profile/Profile";
import MyTeamPage from "../Pages/MyTeam/MyTeam";
import AssetList from "../Pages/AssetList/AssetList";
import AddAnAsset from "../Pages/AddAnAsset/AddAnAsset";
import AllRequests from "../Pages/AllRequests/AllRequests";
import MyEmployeeList from "../Pages/MyEmployeeList/MyEmployeeList"
import AddAnEmployee from "../Pages/AddAnEmployee/AddAnEmployee";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Layout/Dashboard";

export  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children:[
        {
          path:"/",
          element:<Home></Home>
        },
        
        
      ]
    },{
      path:'dashboard',
      element:<Dashboard></Dashboard>,
      children:[
        {
          path:'myAssets',
          element:<PrivateRoute><MyAssets></MyAssets></PrivateRoute>
        },
        {
          path:'requestForAsset',
          element:<PrivateRoute><RequestAssetPage></RequestAssetPage></PrivateRoute>
        },
        {
          path:'profile',
          element:<PrivateRoute><Profile></Profile></PrivateRoute>
        },
        {
          path:'myTeam',
          element:<PrivateRoute><MyTeamPage></MyTeamPage></PrivateRoute>
        },
        {
          path:'assetList',
          element:<PrivateRoute><AssetList></AssetList></PrivateRoute>
        },
        {
          path:'addAnAsset',
          element:<PrivateRoute><AddAnAsset></AddAnAsset></PrivateRoute>
        },
        {
          path:'allRequests',
          element:<PrivateRoute><AllRequests></AllRequests></PrivateRoute>
        },
        {
          path:'myEmployeeList',
          element:<PrivateRoute><MyEmployeeList></MyEmployeeList></PrivateRoute>
        },
        {
          path:'addAnEmployee',
          element:<PrivateRoute><AddAnEmployee></AddAnEmployee></PrivateRoute>
        }
      ]
    },
    {
      path:'/login',
      element:<LogIn></LogIn>
    },
    {
      path:'/joinAsEmployee',
      element:<JoinAsEmployee></JoinAsEmployee>
    },
    {
      path:'/joinAsHr',
      element:<JoinAsHRManager></JoinAsHRManager>
    }


  ]);

