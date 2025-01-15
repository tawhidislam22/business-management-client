import {
    createBrowserRouter,
    
  } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import LogIn from "../Pages/LogIn/LogIn";
import Home from "../Pages/Home/Home";
import JoinAsEmployee from "../Pages/Register/JoinAsEmployee";
import JoinAsHRManager from "../Pages/Register/JoinAsHRManager";


export  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children:[
        {
          path:"/",
          element:<Home></Home>
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

