"use client";
import React from "react";

const Checkbox = ({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  className = "",
  labelClassName = "",
  inputClass = "",
  ...rest
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`lg:w-[26px] lg:h-[26px] w-5 h-5 accent-[var(--teal-1)] cursor-pointer ${inputClass}`}
        {...rest}
      />
      {label && (
        <label
          htmlFor={name}
          className={`lg:text-[16px] text-[12px] font-[400] text-[var(--grey-2)] cursor-pointer ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
