import React from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      {/* logout navbar */}
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-2 border-gray-200">
        <img
          src={assets.logo}
          onClick={() => {
            navigate("/");
          }}
          className="w-32 sm:w-40 cursor-pointer"
          alt="logo"
        />
        <button
          onClick={logout}
          className="rounded-full text-sm font-medium cursor-pointer 
             bg-primary text-white px-10 py-2.5 shadow-md 
             hover:bg-primary/80 hover:shadow-xl hover:shadow-primary/50 
             transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
          Logout
        </button>
      </div>
      {/*  */}
      <div className="flex h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
