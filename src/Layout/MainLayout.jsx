import { Outlet } from "react-router-dom";
import Navbar from "../Shered/Navbar/Navbar";
import Footer from "../Shered/Footer/Footer";


const MainLayout = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;