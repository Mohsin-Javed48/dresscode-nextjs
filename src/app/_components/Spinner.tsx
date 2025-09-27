import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "neutral" | "white";

type SpinnerProps = {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
};

const sizeToPixels: Record<SpinnerSize, number> = {
  sm: 20,
  md: 28,
  lg: 40,
  xl: 56,
};

const variantToColorClass: Record<SpinnerVariant, string> = {
  primary: "text-indigo-600",
  neutral: "text-gray-700",
  white: "text-white",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  label,
  className = "",
}) => {
  const px = sizeToPixels[size];
  const colorClass = variantToColorClass[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 50 50"
        className={`${colorClass} animate-spin`}
      >
        {/* Track */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="6"
          className="text-gray-300"
          stroke="currentColor"
        />
        {/* Indicator */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="90"
          strokeDashoffset="60"
          stroke="currentColor"
        />
      </svg>
      {label ? (
        <span className="text-sm text-gray-500">{label}</span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
};

export default Spinner;
