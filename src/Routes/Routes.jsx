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


export  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children:[
        {
          path:"/",
          element:<Home></Home>
        },
        {
          path:'/myAssets',
          element:<MyAssets></MyAssets>
        },
        {
          path:'/requestForAsset',
          element:<RequestAssetPage></RequestAssetPage>
        },
        {
          path:'/profile',
          element:<Profile></Profile>
        },
        {
          path:'/myTeam',
          element:<MyTeamPage></MyTeamPage>
        },
        {
          path:'/assetList',
          element:<AssetList></AssetList>
        },
        {
          path:'/addAnAsset',
          element:<AddAnAsset></AddAnAsset>
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

