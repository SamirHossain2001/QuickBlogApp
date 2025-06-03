import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        className="w-32 sm:w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer 
             bg-primary text-white px-10 py-2.5 shadow-md 
             hover:bg-primary/80 hover:shadow-xl hover:shadow-primary/50 
             transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
        Login
        <img src={assets.arrow} className="w-3" alt="login arrow" />
      </button>
    </div>
  );
};

export default Navbar;
