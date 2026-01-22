"use client";
import React, { useState, useRef, useEffect } from "react";
import Typography from "../Typography/Typography";
import clsx from "clsx";
import { toTitleCase } from "@/utils/string";

const Dropdown = ({
  options = [],
  placeholder = "Select an option",
  label,
  className,
  buttonStyle,
  labelStyle,
  onChange,
  containerClass,
  borderBottom,
  fullWidth,
  iconOnly,
  iconWithPlaceholder,
  customWidth,
  value,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (value) {
      setSelected(value);
    } else {
      setSelected(placeholder);
    }
  }, [value, placeholder]);

  const handleSelect = (option) => {
    onChange?.(option);
    setSelected(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${containerClass}`}>
      {label && (
        <Typography variant="h5" className={`block ${labelStyle} shrink-0`}>
          {label}
        </Typography>
      )}
      <div
        className={clsx(
          "relative text-left",
          className,
          fullWidth && "!w-full"
        )}
        ref={dropdownRef}
      >
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={clsx(
            "w-full p-3 inline-flex gap-2 justify-between items-center",
            disabled && "opacity-50 cursor-not-allowed",
            borderBottom
              ? "border-b border-[var(--placeholder)] focus:border-b-2 focus:border-[var(--teal-2)]"
              : [
                  "outline outline-offset-[-1px] outline-[var(--teal-3)] focus:outline-none",
                  !iconOnly ||
                    (!iconWithPlaceholder &&
                      "focus:ring-2 focus:ring-offset-2 focus:ring-[var(--teal-2)]"),
                ],
            buttonStyle
          )}
        >
          {iconOnly || iconWithPlaceholder ? (
            <span
              className={`"text-left  ${
                iconWithPlaceholder
                  ? "text-[var(--teal-1)] lg:text-[14px] text-[12px] font-[400]"
                  : "text-[var(--grey-2)] lg:text-[16px] text-[14px] font-[500]"
              }  w-full truncate"`}
            >
              {typeof selected === "object"
                ? toTitleCase(selected.custom_title) ||
                  toTitleCase(selected.label) ||
                  toTitleCase(selected.name) ||
                  toTitleCase(selected.value) ||
                  toTitleCase(selected.size)
                : toTitleCase(selected)}
            </span>
          ) : (
            <span className="text-left text-[12px] font-[400] text-[var(--placeholder)] w-full truncate !capitalize">
              {typeof selected === "object"
                ? toTitleCase(selected.custom_title) ||
                  toTitleCase(selected.label) ||
                  toTitleCase(selected.name) ||
                  toTitleCase(selected.value) ||
                  toTitleCase(selected.size)
                : toTitleCase(selected)}
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="7"
            viewBox="0 0 13 7"
            fill="none"
            className={clsx(
              "transform transition-transform duration-200",
              {
                "rotate-180": isOpen,
                "rotate-0": !isOpen,
              },
              iconOnly || iconWithPlaceholder ? "h-[8px] w-[18px]" : "h-5 w-5"
            )}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.520162 0.388326C0.408644 0.499829 0.408644 0.680632 0.520162 0.792136L6.21363 6.48561C6.49241 6.76438 6.94439 6.76438 7.22316 6.48561L12.9166 0.79215C13.0281 0.680632 13.0281 0.499843 12.9166 0.388326C12.8051 0.276822 12.6243 0.276822 12.5128 0.388326L6.81935 6.08178C6.7636 6.13755 6.6732 6.13755 6.61744 6.08178L0.923971 0.388326C0.812468 0.276808 0.631665 0.276808 0.520162 0.388326Z"
              fill="#222223"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className={clsx(
              "absolute z-[9999] mt-2 origin-top-right shadow-lg ring-1 ring-[var(--teal-3)] ring-opacity-5 bg-[var(--grey-00)]",
              customWidth ? customWidth : "w-[160px]",
              fullWidth ? "!w-[100%]" : ""
            )}
            style={{ top: "100%", right: 0 }}
          >
            <div className="py-1 text-[var(--grey-2)] max-h-[250px] overflow-y-auto custom-scroll">
              {options.map((option, index) => {
                return (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 xl:text-[14px] text-[12px] font-[400] hover:bg-[var(--teal-1)] hover:text-white !capitalize"
                    onClick={() => handleSelect(option)}
                  >
                    {typeof option === "object"
                      ? toTitleCase(option.custom_title) ||
                        toTitleCase(option.label) ||
                        toTitleCase(option.name) ||
                        toTitleCase(option.value) ||
                        toTitleCase(option.size)
                      : toTitleCase(option)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
