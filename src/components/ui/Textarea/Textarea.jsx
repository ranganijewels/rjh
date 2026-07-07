"use client";
import React from "react";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  borderBottom,
  containerClass,
  hasError = false,
  rows = 4,
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError && name ? `${name}-error` : undefined}
        className={`w-full ${
          borderBottom
            ? "border-b py-[16px] pl-[10px] pr-[36px] md:py-[12px] focus:border-b-2 focus:border-[var(--teal-2)]"
            : "border focus:ring-2 focus:ring-[var(--teal-2)] focus:border-transparent p-[10px_20px]"
        } ${hasError ? "border-red-500" : "border-[var(--placeholder)]"} focus:outline-none focus:ring-2 focus:ring-[var(--teal-2)] focus:ring-offset-1 caret-[var(--teal-2)]
        disabled:bg-[var(--grey-0)] disabled:opacity-60 disabled:cursor-not-allowed
        xl:text-[16px] text-[12px] font-[400]
        placeholder:xl:text-[16px] placeholder:text-[12px]
        ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Textarea;
