"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import clsx from "clsx";
import { useCustomizeData } from "@/commomPages/Customize/useCustomizeData";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useRouter } from "next/navigation";
import { responsiveImg } from "@/lib/imageSizes";

const MenuOptionsPanel = ({ activeMenu, setActiveMenu, menus }) => {
  const router = useRouter();
  // const selectedMenu = MENUS_OPTIONS.find((menu) => menu.title === activeMenu);
  const selectedMenu = menus.find((menu) => menu.title === activeMenu);
  if (!selectedMenu) return null;
  const isCustomize = selectedMenu?.categoriesWithMedia === true;
  const { customizeData } = useCustomizeData();
  const panelRef = useRef();
  const normalizeString = (str) => str?.toLowerCase().replace(/[^a-z]/g, "");

  const { fetchAll: fetchCategories } = useCrudApi(`/api/product/categories`);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((categories) => {
        setCategories(categories.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [fetchCategories]);

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
        "2xl:px-[380px] xl:px-[170px] lg:px-[90px]",
        "transition-all duration-300 ease-in-out transform-gpu",
        {
          "opacity-100 translate-y-0 visible": activeMenu,
          "opacity-0 -translate-y-3 invisible": !activeMenu,
        }
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {!isCustomize &&
        selectedMenu?.categories?.map((category, index) => {
          return (
            <div
              className="flex xl:gap-[10px] lg:gap-[10px] flex-col w-full"
              key={index}
            >
              <h3 className="xl:text-[14px] lg:text-[12px] font-[500] xl:mb-[14px] lg:mb-[8px]">
                {category.link ? (
                  <Link
                    href={category.link}
                    className="hover:text-[var(--teal-1)]"
                    onClick={() => setActiveMenu(null)}
                  >
                    {category.title}
                  </Link>
                ) : (
                  category.title
                )}
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
                    {item.label || item}
                  </Link>
                );
              })}
            </div>
          );
        })}

      {isCustomize && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[24px] w-full">
          {selectedMenu.mediaCategories?.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              onClick={() => setActiveMenu(null)}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden bg-white">
                <img loading="lazy" decoding="async"
                  {...responsiveImg(item.image, "(min-width: 1024px) 20vw, 50vw")}
                  src={item.image}
                  alt={item.label}
                  className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-[14px] text-center text-[14px] font-[500] tracking-wide">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Image and CTA section */}
      {Array.isArray(selectedMenu.imageSection) &&
        selectedMenu?.imageSection?.map((section, idx) => (
          <div key={idx} className="xl:min-w-[301px] lg:min-w-[259px]">
            <img loading="lazy" decoding="async"
              {...responsiveImg(section.imageUrl, "(min-width: 1280px) 369px, 259px")}
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
