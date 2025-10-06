"use client";

import React, { useState, useEffect } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  User,
  Phone,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  console.log("routerrr", router);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem("user");
        console.log("userDataee", userData);
        if (userData) {
          // Verify the session is still valid by checking with the server
          const response = await fetch(
            "http://localhost:8000/api/user/verify-session",
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("responseee", response);

          if (response.ok) {
            // User is already logged in, redirect to home
            router.push("/");
            return;
          } else {
            // Session is invalid, clear local data
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // On error, clear local data and allow signup
        localStorage.removeItem("user");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone: allow +country code and 10-15 digits total
    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data for API (exclude confirmPassword and agreeToTerms)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, agreeToTerms, ...signupData } = formData;

      // Add profile image if available
      const finalSignupData = {
        ...signupData,
        image: profileImage || "",
      };

      console.log("signupData", JSON.stringify(finalSignupData));

      const response = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalSignupData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        // Show OTP verification screen
        setUserId(data.userId);
        setShowOTP(true);
      } else {
        // Handle signup error
        setErrors({ general: data.message || "Signup failed" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "One number", met: /\d/.test(formData.password) },
  ];

  const handleOTPChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = element.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    if (!userId) return;

    setIsLoading(true);
    setOtpError("");

    try {
      const requestData = {
        userId,
        otp: otpCode,
        image: profileImage || "", // Include profile image if available
      };

      console.log("🔍 Sending OTP verification with data:", requestData);
      console.log("🔍 Profile image being sent:", profileImage);

      const response = await fetch(
        "http://localhost:8000/api/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("🔍 OTP verification response:", data);

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        console.log("OTP verification successful:", data);
        // Redirect to home page
        window.location.href = "/";
      } else {
        setOtpError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userId) return;

    setIsLoading(true);
    setOtpError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Reset OTP input
        setOtp(new Array(6).fill(""));
        setOtpError("");
        console.log("OTP resent successfully");
      } else {
        setOtpError(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setOtpError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate avatar with first letter of name when OTP screen shows
  useEffect(() => {
    console.log("🔍 OTP useEffect triggered:", {
      showOTP,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      profileImage,
    });

    if (showOTP && formData.firstName && !profileImage) {
      console.log(
        "🚀 Generating avatar for user:",
        formData.firstName,
        formData.lastName
      );

      // Generate avatar with first letter of name
      const firstLetter = formData.firstName.charAt(0).toUpperCase();
      const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=200&bold=true`;

      console.log("🔍 Generated avatar URL:", avatarUrl);
      setProfileImage(avatarUrl);
    }
  }, [
    showOTP,
    formData.firstName,
    formData.lastName,
    formData.email,
    profileImage,
  ]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show OTP verification screen
  if (showOTP) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <button
          onClick={() => setShowOTP(false)}
          className="absolute top-6 left-6 text-gray-600 hover:text-black transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Image
                src="/dresscode-icon.png"
                alt="The Dresscode Logo"
                width={50}
                height={50}
                priority
              />
              <h1 className="text-3xl font-black text-gray-900">DRESSCODE</h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              Enter the verification code sent to{" "}
              <span className="font-medium text-gray-900">
                {formData.email}
              </span>
            </p>

            {/* Show user avatar */}
            {profileImage && (
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OTP Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {otpError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{otpError}</p>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(e.target, index)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors border-gray-200"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={() => handleVerifyOTP(otp.join(""))}
              disabled={isLoading || otp.some((digit) => digit === "")}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Verify Code"
              )}
            </button>

            {/* Resend Section */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm font-medium text-black hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Resend Code
              </button>
            </div>

            {/* Manual Entry */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to {formData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-black transition-colors flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </Link>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Image
              src="/dresscode-icon.png"
              alt="The Dresscode Logo"
              width={50}
              height={50}
              priority
            />
            <h1 className="text-3xl font-black text-gray-900">DRESSCODE</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Join thousands of happy customers and start shopping
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                      errors.firstName ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                      errors.lastName ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    errors.phone ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    errors.password ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Check
                        className={`w-3 h-3 ${req.met ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span
                        className={req.met ? "text-green-600" : "text-gray-500"}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-gray-200 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-black font-medium hover:text-gray-800 transition-colors"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-black font-medium hover:text-gray-800 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-black font-medium hover:text-gray-800 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
