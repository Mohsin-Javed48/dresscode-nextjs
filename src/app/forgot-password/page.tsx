"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserId(data.userId);
        setShowOTP(true);
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await fetch(
        "http://localhost:8000/api/user/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowNewPassword(true);
        setOtpError("");
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setPasswordError(
        "Password must contain uppercase, lowercase, and number"
      );
      return;
    }

    setIsLoading(true);
    setPasswordError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page
        router.push(
          "/login?message=Password reset successfully. Please login with your new password."
        );
      } else {
        setPasswordError(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setPasswordError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { text: "One number", met: /\d/.test(newPassword) },
  ];

  // Show new password form
  if (showNewPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <button
          onClick={() => setShowNewPassword(false)}
          className="absolute top-6 left-6 text-gray-600 hover:text-black transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
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
              Set New Password
            </h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {/* New Password Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {passwordError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{passwordError}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
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
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
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
          <ArrowLeft className="w-4 h-4" />
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
              Verify Reset Code
            </h2>
            <p className="text-gray-600">
              Enter the verification code sent to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
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

            {/* Manual Entry */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to {email}
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
        <ArrowLeft className="w-4 h-4" />
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
            Forgot Password?
          </h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a code to reset your
            password
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">
                Reset code sent successfully!
              </p>
            </div>
          )}

          <form onSubmit={handleSendOTP} className="space-y-6">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
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
                  Send Reset Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
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
