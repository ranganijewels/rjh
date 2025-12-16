"use client";
import React, { useEffect, useRef } from "react";
import Button from "@/components/ui/Button/Button";
import { MENUS_OPTIONS } from "./constant";
import Link from "next/link";
import clsx from "clsx";
import { toTitleCase } from "@/utils/string";

const MenuOptionsPanel = ({ activeMenu, setActiveMenu, menus }) => {
  // const selectedMenu = MENUS_OPTIONS.find((menu) => menu.title === activeMenu);
  const selectedMenu = menus.find((menu) => menu.title === activeMenu);
  if (!selectedMenu) return null;

  const panelRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.top = "0px";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu, setActiveMenu]);
  return (
    // <div
    //   className={`hidden lg:flex justify-between xl:py-[37px] lg:py-[25px] mx-auto 2xl:px-[138px] xl:px-[30px] lg:px-[30px] bg-[var(--grey-00)] absolute z-50 w-full`}
    //   onMouseLeave={() => setActiveMenu(null)}
    // >
    <div
      ref={panelRef}
      className={clsx(
        "absolute z-50 w-full gap-[20px]",
        "bg-[var(--grey-00)] hidden lg:flex justify-between",
        "xl:py-[37px] lg:py-[25px] mx-auto",
        "2xl:px-[256px] xl:px-[100px] lg:px-[30px]",
        "transition-all duration-300 ease-in-out transform-gpu",
        {
          "opacity-100 translate-y-0 visible": activeMenu,
          "opacity-0 -translate-y-3 invisible": !activeMenu,
        }
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {selectedMenu?.categories?.map((category, index) => {
        return (
          <div
            className="flex xl:gap-[10px] lg:gap-[10px] flex-col"
            key={index}
          >
            <h3 className="xl:text-[14px] lg:text-[12px] font-[500] xl:mb-[14px] lg:mb-[8px] uppercase">
              {category.title}
            </h3>

            {category.items?.map((item, idx) => {
              const href =
                typeof item.link === "string"
                  ? item.link
                  : typeof item.href === "string"
                  ? item.href
                  : "/product";

              return (
                <Link
                  href={href}
                  key={idx}
                  className="text-[var(--grey-2)] xl:text-[14px] text-[12px] hover:text-[var(--teal-1)]"
                  onClick={() => setActiveMenu(null)}
                >
                  {toTitleCase(item.label) || toTitleCase(item)}
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Image and CTA section */}
      {Array.isArray(selectedMenu.imageSection) &&
        selectedMenu?.imageSection?.map((section, idx) => (
          <div key={idx} className="xl:w-[301px] lg:w-[259px]">
            <img
              src={section.imageUrl}
              alt={section.additionalTitle}
              className="pb-[16px] xl:w-[369px] xl:h-[241px] lg:w-[259px] lg:h-[192px] object-cover"
            />
            <h2 className="pb-[12px] text-[14px] font-[500]">
              {section.additionalTitle}
            </h2>
            <p className="pb-[20px] text-[12px] font-[400]">
              {section.additionalDescription}
            </p>
            <Link href={section.callToAction.url}>
              <Button title={section.callToAction.text} className="w-full" />
            </Link>
          </div>
        ))}
    </div>
  );
};

export default MenuOptionsPanel;
