"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, Settings, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { clearStoredTokens } from "../_lib/action";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingUser, setIsResolvingUser] = useState(true);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    console.log("🔍 UserDropdown - session:", session);
    console.log("🔍 UserDropdown - session.user:", session?.user);
    console.log("🔍 UserDropdown - session.user.image:", session?.user?.image);

    // Reset image error when user changes
    setImageError(false);

    // First check NextAuth session
    if (session?.user) {
      const userData: UserData = {
        id: (session.user as { id?: string }).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as { role?: string }).role || "customer",
        image: session.user.image || "",
      };
      console.log("🔍 UserDropdown - User data from session:", userData);
      console.log("🖼️ UserDropdown - User image URL:", userData.image);
      console.log("🖼️ UserDropdown - Image exists:", !!userData.image);
      console.log("🖼️ UserDropdown - Image length:", userData.image?.length);
      setUser(userData);
      setIsResolvingUser(false);
      return;
    }

    // Fallback to localStorage
    const userData = localStorage.getItem("user");
    console.log("userDataee", userData);
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("🔍 User data from localStorage:", parsedUserData);
        console.log(
          "🖼️ User image URL from localStorage:",
          parsedUserData.image
        );
        setUser(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsResolvingUser(false);
  }, [session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear stored tokens
      clearStoredTokens();

      // Sign out from NextAuth
      await signOut({
        callbackUrl: "/",
      });

      setUser(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local data even if signOut fails
      clearStoredTokens();
      setUser(null);
      setIsOpen(false);
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading placeholder while session is loading or while resolving user
  if (status === "loading" || isResolvingUser) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-20 h-4 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  // If user is not logged in, show login/signup buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        suppressHydrationWarning
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {user.image && !imageError ? (
            <Image
              src={user.image}
              alt={`${user.name}`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("🖼️ Image failed to load:", user.image);
                console.error("🖼️ Image error event:", e);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("🖼️ Image loaded successfully:", user.image);
                setImageError(false);
              }}
              unoptimized={
                user.image?.startsWith("data:") ||
                user.image?.startsWith("blob:")
              }
            />
          ) : (
            <User className="w-4 h-4 text-gray-600" />
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              My Orders
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
