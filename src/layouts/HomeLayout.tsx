import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import FriendsList from "../components/features/friendsList/FriendsList";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row min-h-screen pt-16">
        <Outlet />
        <FriendsList />
      </div>
      <Footer />
    </>
  );
};

export default HomeLayout;
