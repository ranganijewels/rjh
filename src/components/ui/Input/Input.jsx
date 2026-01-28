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
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full ${
          borderBottom
            ? "border-b focus:border-b-2 focus:border-[var(--teal-2)] py-[10px] pl-[10px] pr-[20px]"
            : "border focus:ring-2 focus:ring-[var(--teal-2)] focus:border-transparent p-[10px_20px]"
        } border-[var(--placeholder)] focus:outline-none  caret-[var(--teal-2)]  md:text-[14px] text-[12px] font-[400] placeholder:md:text-[16px] placeholder:text-[12px] placeholder:capitalize ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
