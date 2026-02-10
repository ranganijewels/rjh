"use client";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Button = ({
  title,
  ariaLabel,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  icon = null,
  iconOnly = false,
  background,
  border,
  textColor,
  hoverColor,
  url,
  disabled,
  noBackground,
  target,
  children,
}) => {
  const router = useRouter();
  const accessibleLabel = ariaLabel || title;

  const baseStyle =
    "xl:p-[12px_30px] p-[6px_16px] cursor-pointer uppercase xl:text-[14px] text-[12px] font-[400] leading-normal tracking-[0.28px] transition-colors duration-200";

  const variantStyles = {
    primary: "bg-[var(--teal-1)] text-[var(--grey-0)]",
    outline:
      "outline outline-[var(--grey-0)] text-[var(--grey-0)] bg-transparent",
    outlineBlack:
      "outline outline-[var(--grey-2)] text-[var(--grey-2)] bg-transparent",
    outlineTeal:
      "outline outline-[var(--teal-1)] text-[var(--teal-1)] bg-transparent",
    secondary: "bg-[var(--grey-00)] text-[var(--teal-1)]",
    ghost: "bg-[var(--grey-0)] text-[var(--teal-1)]",
    filtersOutline:
      "outline outline-[var(--teal-3)] text-[#000000] !p-2 flex items-center justify-center !text-[12px] h-[30px]",
    colorPalette:
      "2xl:w-[20px] 2xl:h-[20px] w-[14px] h-[14px] rounded-[2px] !p-0",
  };

  if (!title && !iconOnly && variant !== "colorPalette") return null;

  const style = {
    background: background,
    border: border ? `1px solid ${border}` : undefined,
    color: textColor,
  };

  const handleClick = (e) => {
    if (disabled) return;

    if (url) {
      if (url.startsWith("/")) {
        router.push(url);
      } else {
        if (target === "_blank") {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = url;
        }
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      aria-label={accessibleLabel}
      className={clsx(
        baseStyle,
        !noBackground && variantStyles[variant],
        icon && !iconOnly && "flex items-center gap-2 justify-center",
        className
      )}
      style={style}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (hoverColor) e.currentTarget.style.background = hoverColor;
      }}
      onMouseLeave={(e) => {
        if (hoverColor) e.currentTarget.style.background = background;
      }}
    >
      {icon && !iconOnly && icon}
      {iconOnly ? icon : title}
    </button>
  );
};

export default Button;
