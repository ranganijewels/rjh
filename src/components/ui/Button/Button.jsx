"use client";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Button = ({
  title,
  ariaLabel,
  ariaPressed,
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
    "xl:p-[12px_30px] lg:p-[10px_26px] lg:text-[13px] md:p-[8px_22px] md:text-[13px] p-[12px_20px] cursor-pointer uppercase xl:text-[14px] text-[12px] font-[400] leading-normal tracking-[0.28px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--teal-1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variantStyles = {
    primary:
      "bg-[var(--teal-1)] text-[var(--grey-0)] hover:bg-[var(--teal-2)] active:opacity-90",
    outline:
      "outline outline-[var(--grey-2)] text-[var(--grey-2)] bg-transparent",
    outlineWhite:
      "outline outline-2 outline-[var(--grey-0)] text-[var(--grey-0)] bg-transparent hover:bg-[var(--grey-0)] hover:text-[var(--teal-1)]",
    outlineBlack:
      "outline outline-[var(--grey-2)] text-[var(--grey-2)] bg-transparent",
    outlineTeal:
      "outline outline-[var(--teal-1)] text-[var(--teal-1)] bg-transparent",
    secondary: "bg-[var(--grey-00)] text-[var(--teal-1)]",
    ghost: "bg-[var(--grey-0)] text-[var(--teal-1)]",
    filtersOutline:
      "outline outline-[var(--teal-3)] text-[var(--grey-2)] !p-2 flex items-center justify-center !text-[12px] h-[40px] lg:h-[30px]",
    colorPalette:
      "relative w-[14px] h-[14px] 2xl:w-[20px] 2xl:h-[20px] rounded-[2px] !p-0 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[24px] before:h-[24px] 2xl:before:w-[20px] 2xl:before:h-[20px]",
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
      aria-pressed={ariaPressed}
      className={clsx(
        baseStyle,
        !noBackground && variantStyles[variant],
        icon && !iconOnly && "flex items-center gap-2 justify-center",
        className
      )}
      style={style}
      disabled={disabled}
      aria-busy={disabled || undefined}
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
