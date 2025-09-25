"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react"; // Added Menu for mobile
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UserDropdown from "./UserDropdown";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchCart, getOrCreateGuestId } from "@/app/_lib/cartClient";

export default function Header() {
  const [showPromo, setShowPromo] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [active, setActive] = useState("/");
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const id = getOrCreateGuestId();
        const { cart } = await fetchCart(id);
        type CartLine = { quantity?: number };
        const count = (cart.items || []).reduce(
          (sum: number, line: CartLine) => sum + (line.quantity || 0),
          0
        );
        setCartCount(count);
      } catch {}
    };
    load();
    const onUpdate = () => load();
    if (typeof window !== "undefined") {
      window.addEventListener("cart:updated", onUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:updated", onUpdate);
      }
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop ▾" },
    { href: "/orders", label: "Orders" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/new-arival", label: "New Arrival" },
  ];

  return (
    <div className="w-full">
      {/* ✅ Promo Bar (Full Width) */}
      {showPromo && (
        <div className="bg-black text-white text-xs sm:text-sm flex justify-center items-center sm:items-start py-2 px-4 relative w-full">
          <span className="text-center pr-8">
            Sign up and get 20% off your first order.{" "}
            <a href="#" className="underline font-semibold whitespace-nowrap">
              Sign Up Now
            </a>
          </span>
          <button
            className="absolute right-2 sm:right-4 lg:right-10 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowPromo(false)}
            suppressHydrationWarning
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      )}

      {/* ✅ Main Nav inside a container */}
      <div className="w-full max-w-screen-3xl mx-auto  sm:px-4 md:px-12 lg:px-12">
        <nav className="bg-white flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
          {/* Left Section */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-12">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              suppressHydrationWarning
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            {/* Logo */}
            <div className="text-lg sm:text-xl lg:text-2xl font-extrabold flex flex-row gap-2 justify-center items-center">
              <Image
                src="/dresscode-icon.png"
                alt="The Dresscode Logo"
                width={45} // or any size
                height={45}
                priority
              />
              DRESSCODE
            </div>

            {/* Desktop Menu Items */}
            <ul className="hidden md:flex gap-4 lg:gap-6 text-gray-700 text-sm lg:text-base">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setActive(item.href)}
                    className={`cursor-pointer hover:text-black transition-colors ${
                      active === item.href ? "text-black font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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
                suppressHydrationWarning
              />
            </div>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden p-2"
              suppressHydrationWarning
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {/* Icons */}
            <button
              className="relative p-1"
              suppressHydrationWarning
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 hover:text-black transition-colors cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <UserDropdown />
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
                suppressHydrationWarning
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
                Orders
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 border-b border-gray-100 text-gray-700">
                About Us
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 border-b border-gray-100 text-gray-700">
                Contact
              </li>
              <li className="cursor-pointer hover:text-black transition-colors py-2 text-gray-700">
                New Arrival
              </li>
            </ul>

            {/* Mobile User Section */}
            <div className="px-3 sm:px-4 py-4 border-t border-gray-100">
              <UserDropdown />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
