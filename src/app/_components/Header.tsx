"use client";

import { useState } from "react";
import { Camera, X, Menu } from "lucide-react"; // Added Menu for mobile
import { ShoppingCart, User, Search } from "lucide-react";

export default function Header() {
  const [showPromo, setShowPromo] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="w-full">
      {/* ✅ Promo Bar (Full Width) */}
      {showPromo && (
        <div className="bg-black text-white text-xs sm:text-sm flex justify-center items-center py-2 px-4 relative w-full">
          <span className="text-center pr-8">
            Sign up and get 20% off your first order.{" "}
            <a href="#" className="underline font-semibold whitespace-nowrap">
              Sign Up Now
            </a>
          </span>
          <button
            className="absolute right-2 sm:right-4 lg:right-10 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowPromo(false)}
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      )}

      {/* ✅ Main Nav inside a container */}
      <div className="w-full max-w-screen-3xl  mx-auto px-12  lg:px">
        <nav className="bg-white flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
          {/* Left Section */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-12">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            {/* Logo */}
            <div className="text-lg sm:text-xl lg:text-2xl font-extrabold">
              DRESSCODE
            </div>

            {/* Desktop Menu Items */}
            <ul className="hidden md:flex gap-4 lg:gap-6 text-gray-700 text-sm lg:text-base">
              <li className="cursor-pointer hover:text-black transition-colors">
                Shop ▾
              </li>
              <li className="cursor-pointer hover:text-black transition-colors">
                On Sale
              </li>
              <li className="cursor-pointer hover:text-black transition-colors">
                New Arrivals
              </li>
              <li className="cursor-pointer hover:text-black transition-colors">
                Brands
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Desktop Search */}
            <div className="relative hidden lg:flex items-center">
              <Search className="absolute left-3 text-[#c5c2c2] w-4 h-4" />
              <input
                type="text"
                placeholder="Search for products..."
                className="border placeholder:text-[#a0a0a0] border-none bg-[#f0f0f0] rounded-full pl-10 pr-4 py-2 w-64 xl:w-80 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              />
            </div>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {/* Icons */}
            <button className="p-1">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-black transition-colors cursor-pointer" />
            </button>
            <button className="p-1">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-black transition-colors cursor-pointer" />
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-3 animate-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c5c2c2] w-4 h-4" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border placeholder:text-[#a0a0a0] border-none bg-[#f0f0f0] rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-b border-gray-200 animate-in slide-in-from-top-2 duration-300">
            <ul className="px-3 sm:px-4 py-4 space-y-4">
              <li className="cursor-pointer hover:text-black transition-colors py-2 border-b border-gray-100 text-gray-700">
                Shop ▾
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 border-b border-gray-100 text-gray-700">
                On Sale
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 border-b border-gray-100 text-gray-700">
                New Arrivals
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 text-gray-700">
                Brands
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
