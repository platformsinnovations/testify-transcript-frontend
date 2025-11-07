import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  className,
  href,
  width = '120px',
  height = '40px',
  backgroundColor = '#04BF68',
  textColor = 'white',
  borderRadius = '8px',
  angle = '0deg',
  opacity = '1',
  gap = '8px',
  paddingTop = '12px',
  paddingRight = '16px',
  paddingBottom = '12px',
  paddingLeft = '16px',
  disabled = false,
  loading: externalLoading,
  loadingText = 'Loading',
  type = 'button',
  onClick,
  ...props
}) => {
  const [internalLoading, setInternalLoading] = React.useState(false);
  
  // USE EXTERNAL LOADING IF PROVIDED, OTHERWISE USE INTERNAL STATE
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  // WRAP onClick TO HANDLE ASYNC FUNCTIONS AUTOMATICALLY
  const handleClick = async (e) => {
    if (!onClick || loading || disabled) return;
    
    // IF onClick RETURNS A PROMISE, MANAGE LOADING STATE
    const result = onClick(e);
    if (result instanceof Promise) {
      setInternalLoading(true);
      // FORCE REACT TO RENDER THE LOADING STATE AND ENSURE IT'S VISIBLE FOR AT LEAST 300MS
      const [, ] = await Promise.all([
        result,
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      setInternalLoading(false);
    }
  };

  // BASE STYLES USING TAILWIND CLASSES
  const baseStyles = `
    inline-flex
    items-center
    justify-center
    transition-all
    duration-200
    ease-in-out
    font-normal
    hover:opacity-90
    disabled:opacity-50
    disabled:cursor-not-allowed
    cursor-pointer
    whitespace-nowrap
  `;

  // DYNAMIC STYLES BASED ON PROPS
  const dynamicStyles = {
    width,
    height,
    backgroundColor,
    textColor,
    color: textColor,
    borderRadius,
    transform: `rotate(${angle})`,
    opacity,
    gap,
    padding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
  };

  // COMBINE BASE STYLES WITH CUSTOM STYLES USING TAILWIND-MERGE
  const combinedClassName = twMerge(
    baseStyles,
    'w-full sm:w-auto', // Responsive width
    'text-sm sm:text-base', // Responsive font size
    'px-4 sm:px-6', // Responsive padding
    className
  );

  // IF href IS PROVIDED, RENDER AS LINK
  if (href) {
    // PREVENT NAVIGATION WHEN LOADING OR DISABLED
    const handleLinkClick = (e) => {
      if (loading) {
        e.preventDefault();
      }
      if (onClick) handleClick(e);
    };

    return (
      <Link
        href={href}
        className={combinedClassName}
        style={dynamicStyles}
        onClick={handleLinkClick}
        aria-disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>{loadingText}</span>
          </span>
        ) : (
          children
        )}
      </Link>
    );
  }

  // OTHERWISE, RENDER AS BUTTON
  return (
    <button
      type={type}
      className={combinedClassName}
      style={dynamicStyles}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;