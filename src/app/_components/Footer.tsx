"use client";

import React, { useState } from "react";
import { Mail, Facebook, Instagram, Github, Twitter } from "lucide-react";

const ShopFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <div className="relative">
      {/* Newsletter Section - Positioned to overlap */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 -mb-8 sm:-mb-10 lg:-mb-12">
        <div className="bg-black rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-7 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 lg:gap-6">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight max-w-md text-center md:text-left">
            STAY UPTO DATE ABOUT
            <br />
            OUR LATEST OFFERS
          </h2>
          <div className="flex flex-col gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full sm:w-72 md:w-80 pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-full border-none outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSubscribe}
              className="w-full sm:w-72 md:w-80 bg-white text-black font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-full hover:bg-gray-100 transition-colors"
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Footer Background */}
      <div className="bg-gray-100 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8">
        {/* Footer Links Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-7 lg:gap-8 mb-12 sm:mb-14 lg:mb-16">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4">
                SHOP.CO
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6 max-w-xs mx-auto sm:mx-0">
                We have clothes that suits your style and which you&apos;re
                proud to wear. From women to men.
              </p>
              <div className="flex gap-2.5 sm:gap-3 justify-center sm:justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 cursor-pointer transition-colors">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
              </div>
            </div>

            {/* Company Column */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-black mb-3 sm:mb-4 tracking-wider text-sm sm:text-base">
                COMPANY
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-black mb-3 sm:mb-4 tracking-wider text-sm sm:text-base">
                HELP
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Customer Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Delivery Details
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* FAQ Column */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-black mb-3 sm:mb-4 tracking-wider text-sm sm:text-base">
                FAQ
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Account
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Manage Deliveries
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Orders
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Payments
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-black mb-3 sm:mb-4 tracking-wider text-sm sm:text-base">
                RESOURCES
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Free eBooks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Development Tutorial
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    How to - Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 text-sm hover:text-black transition-colors block"
                  >
                    Youtube Playlist
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-300 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              Shop.co © 2000-2023. All Rights Reserved
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-wrap justify-center">
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 min-w-0">
                <span className="text-blue-600 font-bold text-xs sm:text-sm whitespace-nowrap">
                  VISA
                </span>
              </div>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 min-w-0">
                <div className="w-6 h-3 sm:w-8 sm:h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-sm"></div>
              </div>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 min-w-0">
                <span className="text-blue-600 font-bold text-xs sm:text-sm whitespace-nowrap">
                  PayPal
                </span>
              </div>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 min-w-0">
                <span className="text-black font-bold text-xs sm:text-sm whitespace-nowrap">
                  Apple Pay
                </span>
              </div>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 min-w-0">
                <span className="text-green-600 font-bold text-xs sm:text-sm whitespace-nowrap">
                  G Pay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFooter;
