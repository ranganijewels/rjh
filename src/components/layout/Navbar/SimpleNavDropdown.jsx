"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";

// Flat single-column dropdown for admin-added top-level nav items that don't
// match one of the 5 named MENUS_OPTIONS menus — no imagery/multi-column
// layout, just this item's sub-links. Mirrors MenuOptionsPanel's positioning
// classes so it lines up with the rest of the nav, deliberately without its
// multi-column/imageSection layout.
const SimpleNavDropdown = ({ activeMenu, setActiveMenu, item }) => {
  if (!item?.children?.length) return null;

  return (
    <div
      className={clsx(
        "absolute z-50 w-full",
        "bg-[var(--grey-00)] hidden lg:flex",
        "xl:py-[28px] lg:py-[20px] mx-auto",
        "2xl:px-[380px] xl:px-[170px] lg:px-[90px]",
        "transition-all duration-300 ease-in-out transform-gpu",
        {
          "opacity-100 translate-y-0 visible": activeMenu,
          "opacity-0 -translate-y-3 invisible": !activeMenu,
        }
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="flex flex-col xl:gap-[14px] lg:gap-[10px]">
        {item.children.map((child, idx) => (
          <Link
            key={child.id ?? idx}
            href={child.link || "#"}
            target={child.target === "_blank" ? "_blank" : undefined}
            rel={child.target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-[var(--grey-2)] xl:text-[14px] text-[12px] hover:text-[var(--teal-1)]"
            onClick={() => setActiveMenu(null)}
          >
            {child.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimpleNavDropdown;
