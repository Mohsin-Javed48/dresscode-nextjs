import React, { useCallback, useMemo, useRef, useState } from "react";

type RatingProps = {
  /** Current value (controlled). Range: 0..max, halves allowed if allowHalf=true */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Called when value changes */
  onChange?: (value: number) => void;
  /** Number of stars */
  max?: number;
  /** Allow selecting half stars (0.5 increments) */
  allowHalf?: boolean;
  /** Allow clearing to 0 by clicking the current value */
  allowClear?: boolean;
  /** Read-only (still shows hover if not disabled, but no changes) */
  readOnly?: boolean;
  /** Disabled (no hover, no focus) */
  disabled?: boolean;
  /** Size in pixels for the star icon */
  size?: number;
  /** Class applied to the filled portion */
  classNameFilled?: string;
  /** Class applied to the empty portion */
  classNameEmpty?: string;
  /** Additional wrapper class */
  className?: string;
  /** aria-label for screen readers */
  ariaLabel?: string;
  /** Name for grouping in forms (if you want to use as an input) */
  name?: string;
};

export const Rating: React.FC<RatingProps> = ({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = true,
  allowClear = true,
  readOnly = false,
  disabled = false,
  size = 24,
  classNameFilled = "text-yellow-400",
  classNameEmpty = "text-gray-300 dark:text-gray-600",
  className = "",
  ariaLabel = "Rating",
  name,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const current = isControlled ? (value as number) : internalValue;

  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayValue = hoverValue ?? current;

  const clamp = useCallback(
    (v: number) =>
      Math.max(
        0,
        Math.min(max, allowHalf ? Math.round(v * 2) / 2 : Math.round(v))
      ),
    [max, allowHalf]
  );

  const commitChange = useCallback(
    (v: number) => {
      if (readOnly || disabled) return;
      const next = clamp(v);
      const final = allowClear && next === current ? 0 : next;
      if (!isControlled) setInternalValue(final);
      onChange?.(final);
    },
    [allowClear, clamp, current, disabled, isControlled, onChange, readOnly]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly || disabled) return;
    const step = allowHalf ? 0.5 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commitChange(clamp((hoverValue ?? current) + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commitChange(clamp((hoverValue ?? current) - step));
    } else if (e.key === "Home") {
      e.preventDefault();
      commitChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      commitChange(max);
    } else if (e.key === "Enter" || e.key === " ") {
      // no-op since commit happens on arrow; keep for a11y semantics
      e.preventDefault();
    }
  };

  const starIndexes = useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  );

  const handleMouseMove =
    (i: number) => (e: React.MouseEvent<SVGSVGElement>) => {
      if (readOnly || disabled) return;
      if (!allowHalf) {
        setHoverValue(i);
        return;
      }
      // Determine half or full based on mouse X within the star
      const { left, width } = (
        e.currentTarget as SVGSVGElement
      ).getBoundingClientRect();
      const isHalf = e.clientX - left < width / 2;
      setHoverValue(isHalf ? i - 0.5 : i);
    };

  const handleMouseLeave = () => setHoverValue(null);

  const handleClick = (i: number) => () => {
    if (readOnly || disabled) return;
    const next = clamp(hoverValue ?? i);
    commitChange(next);
  };

  // SVG star path (outline). We'll fill by stacking two stars: empty below, filled above with width mask.
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={(filled ? classNameFilled : classNameEmpty) + " inline-block"}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 17.27l-5.64 3.36 1.45-6.19L2.4 9.97l6.33-.54L12 3.5l3.27 5.93 6.33.54-5.41 4.47 1.45 6.19z"
      />
    </svg>
  );

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div
        ref={containerRef}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={displayValue}
        aria-readonly={readOnly || disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={`flex items-center outline-none ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {starIndexes.map((i) => {
          const full = displayValue >= i;
          const half = allowHalf && displayValue >= i - 0.5 && displayValue < i;
          return (
            <div
              key={i}
              className="relative leading-none"
              onClick={handleClick(i)}
            >
              {/* Empty star base */}
              <StarIcon filled={false} />
              {/* Filled star (full) */}
              {full && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <StarIcon filled={true} />
                </div>
              )}
              {/* Half star (clip the right half) */}
              {half && (
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <StarIcon filled={true} />
                </div>
              )}
              {/* Hover detection layer (so half/full works reliably) */}
              <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className="absolute inset-0 opacity-0"
                onMouseMove={handleMouseMove(i)}
                onMouseEnter={handleMouseMove(i)}
              />
            </div>
          );
        })}
      </div>

      {/* Optional hidden input to use in forms */}
      {name && <input type="hidden" name={name} value={String(current)} />}
      {/* Visually hidden live region for screen readers */}
      <span className="sr-only" aria-live="polite">
        {displayValue} out of {max} stars
      </span>
    </div>
  );
};

/* ----------------------- Usage examples -----------------------

Uncontrolled:
<Rating defaultValue={3.5} onChange={(v) => console.log(v)} />

Controlled:
const [rating, setRating] = useState(4);
<Rating value={rating} onChange={setRating} />

Customize:
<Rating max={10} allowHalf={false} size={32} classNameFilled="text-amber-500" />

Read-only / disabled:
<Rating value={4.5} readOnly />
<Rating value={2} disabled />

In a horizontal row with text:
<div className="flex items-center gap-2">
  <Rating value={4} onChange={...} />
  <span className="text-sm text-gray-500">4.0</span>
</div>

-------------------------------------------------------------- */
