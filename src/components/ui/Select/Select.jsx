"use client";
import React from "react";

const Select = ({
  options,
  value,
  onChange,
  className = "",
  optionStyle = "",
  placeholder = "",
}) => {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-[12px] font-[500] ${className}`}
    >
      {/* Placeholder option */}
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt) => {
        if (typeof opt === "string") {
          return (
            <option
              key={opt}
              value={opt}
              className={`text-[var(--grey-2)] ${optionStyle}`}
            >
              {opt}
            </option>
          );
        }
        return (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
