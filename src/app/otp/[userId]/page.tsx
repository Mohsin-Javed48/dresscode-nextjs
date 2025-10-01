"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OTPScreenProps {
  phoneNumber?: string;
  email?: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  resendCooldown?: number; // in seconds
}

export default function OTPScreen({
  phoneNumber,
  email,
  onVerify,
  onResend,
  isLoading = false,
  error,
  success = false,
  onBack,
  title = "Verify Your Phone",
  subtitle = "Enter the verification code sent to",
  resendCooldown = 60,
}: OTPScreenProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(resendCooldown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend cooldown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveOtpIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
      onVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        setActiveOtpIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    setActiveOtpIndex(nextIndex);
    inputRefs.current[nextIndex]?.focus();

    // Auto-verify if all digits are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.length === 6) {
      onVerify(newOtp.join(""));
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResend();
      setTimeLeft(resendCooldown);
      setCanResend(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const displayContact = phoneNumber || email || "your device";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-600 hover:text-black transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {success ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Verification Successful!
              </h2>
              <p className="text-gray-600">
                Your phone number has been verified.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">
                {subtitle}{" "}
                <span className="font-medium text-gray-900">
                  {displayContact}
                </span>
              </p>
            </>
          )}
        </div>

        {/* OTP Form */}
        {!success && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors ${
                    activeOtpIndex === index
                      ? "border-black ring-2 ring-gray-200"
                      : digit
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                  }`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={() => onVerify(otp.join(""))}
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
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className={`text-sm font-medium transition-colors ${
                  canResend
                    ? "text-black hover:text-gray-800"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {canResend ? (
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-4 h-4" />
                    Resend Code
                  </span>
                ) : (
                  `Resend in ${formatTime(timeLeft)}`
                )}
              </button>
            </div>

            {/* Manual Entry */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to {displayContact}
              </p>
            </div>
          </div>
        )}

        {/* Success Actions */}
        {success && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-6">
              You can now continue with your account setup.
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Continue to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
