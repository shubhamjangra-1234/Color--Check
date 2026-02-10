import { Outlet } from "react-router-dom";
import Navbar from "../UI/Navbar/Navbar";
import Footer from "../UI/Footer/Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
