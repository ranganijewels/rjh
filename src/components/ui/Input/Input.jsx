"use client";
import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  borderBottom,
  containerClass,
  rightIcon,
  hasError = false,
  ...rest
}) => {
  return (
    <div className={containerClass}>
      {label && (
        <label
          htmlFor={name}
          className="block lg:text-[16px] text-[12px] font-[400] text-[var(--grey-2)] mb-2 capitalize"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError && name ? `${name}-error` : undefined}
          className={`w-full ${
            borderBottom
              ? "border-b py-[16px] pl-[10px] pr-[36px] md:py-[12px] focus:border-b-2 focus:border-[var(--teal-2)]"
              : "border focus:ring-2 focus:ring-[var(--teal-2)] focus:border-transparent p-[10px_20px]"
          } ${hasError ? "border-red-500" : "border-[var(--placeholder)]"} focus:outline-none focus:ring-2 focus:ring-[var(--teal-2)] focus:ring-offset-1 caret-[var(--teal-2)]
          disabled:bg-[var(--grey-0)] disabled:opacity-60 disabled:cursor-not-allowed
          md:text-[14px] text-[12px] font-[400]
          placeholder:md:text-[16px] placeholder:text-[12px] placeholder:capitalize
          ${className}`}
          {...rest}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
