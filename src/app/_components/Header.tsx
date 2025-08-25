"use client";

import { useState } from "react";
import { Camera, X } from "lucide-react"; // for close icon
import { ShoppingCart, User, Search } from "lucide-react";

export default function page() {
  return (
    <div className="w-full ">
      {/* Promo Bar */}
      {/* {showPromo && ( */}
      <div className="bg-black text-white text-sm flex justify-center items-center py-2 relative">
        <span>
          Sign up and get 20% off your first order.{" "}
          <a href="#" className="underline font-semibold">
            Sign Up Now
          </a>
        </span>
        <button className="absolute right-10 text-white">
          <X size={18} />
        </button>
      </div>
      {/* )} */}

      {/* Main Nav */}
      <nav className="bg-white flex items-center justify-between px-24 py-4">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="text-2xl font-extrabold">DRESSCODE</div>

          {/* Menu Items */}
          <ul className="hidden md:flex gap-6 text-gray-700">
            <li className="cursor-pointer hover:text-black">Shop ▾</li>
            <li className="cursor-pointer hover:text-black">On Sale</li>
            <li className="cursor-pointer hover:text-black">New Arrivals</li>
            <li className="cursor-pointer hover:text-black">Brands</li>
          </ul>
        </div>

        {/* Search + Icons */}
        <div className="relative flex items-center gap-8">
          <Search className="absolute left-3 cursor-pointer text-[#c5c2c2]" />
          <input
            type="text"
            placeholder="Search for products..."
            className="hidden md:block border placeholder:text-[#a0a0a0] border-none bg-[#f0f0f0] rounded-full pl-12 px-4 py-2 w-[1000px] focus:outline-grey-50"
          />
          <ShoppingCart className="cursor-pointer" />
          <User className="cursor-pointer" />
        </div>
      </nav>
    </div>
  );
}
