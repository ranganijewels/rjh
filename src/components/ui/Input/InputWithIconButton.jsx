"use client";
import React from "react";
import Button from "../Button/Button";
import Input from "./Input";

const InputWithIconButton = ({
  icon,
  inputProps = {},
  buttonTitle = "Apply",
  onButtonClick,
  className = "",
  buttonClassName = "",
  disabled = false,
}) => {
  return (
    <div className="flex gap-2 w-full mt-3">
      <div
        className={`flex items-center gap-2 px-3 py-2 border border-[var(--placeholder)] rounded bg-white
      focus-within:ring-2 focus-within:ring-[var(--teal-2)] focus-within:border-transparent
      transition-all duration-200 ${className}`}
      >
        {icon && (
          <span className="mr-2 text-[var(--placeholder)] flex-shrink-0">{icon}</span>
        )}

        <input
          {...inputProps}
          disabled={disabled || inputProps.disabled}
          className={`flex-1 bg-transparent border-none outline-none focus:ring-0 w-full lg:text-[16px] text-[12px] font-[400] placeholder:text-[12px] placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
            inputProps.className || ""
          }`}
        />
      </div>
      <Button
        title={buttonTitle}
        onClick={onButtonClick}
        disabled={disabled}
        className={`!p-[12px_12px] border transition h-auto !font-[500] text-[14px]
          ${buttonClassName}
        `}
      />
    </div>
  );
};

export default InputWithIconButton;
