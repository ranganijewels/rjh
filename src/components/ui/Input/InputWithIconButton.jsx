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
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 border border-[var(--placeholder)] rounded bg-white
      focus-within:ring-2 focus-within:ring-[var(--teal-2)] focus-within:border-transparent
      transition-all duration-200 ${className}`}
    >
      {icon && (
        <span className="mr-2 text-gray-400 flex-shrink-0">
          {icon}
        </span>
      )}

      <input
        {...inputProps}
        className={`flex-1 bg-transparent border-none outline-none focus:ring-0 w-full text-sm placeholder:text-gray-400 ${inputProps.className || ""}`}
      />

      <Button
        noBackground
        title={buttonTitle}
        onClick={onButtonClick}
        className={`!font-[500] !p-0 text-[14px] ${buttonClassName}`}
      />
    </div>
  );
};

export default InputWithIconButton;