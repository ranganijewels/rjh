"use client";
import React, { useState } from "react";
import clsx from "clsx";
import Accordion from "@/components/ui/Accordion/Accordion";
import Button from "@/components/ui/Button/Button";
import SocialMediaIcons from "@/components/ui/SocialMediaIcons/SocialMediaIcons";
import Link from "next/link";
import { SOCIAL_MEDIA_ICONS } from "@/constants/constant";
import { useCustomizeData } from "@/commomPages/Customize/useCustomizeData";
import { toTitleCase } from "@/utils/string";
import { useRouter } from "next/navigation";

const MobileNav = ({ closeMobile, menus }) => {
  const router = useRouter();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = useState("");
  const subMenu = menus.find(
    (menu) =>
      selectedMainMenu?.label &&
      menu.title.toLowerCase() === selectedMainMenu.label.toLowerCase()
  );
  const { customizeData } = useCustomizeData();
  const isCustomize = subMenu?.categoriesWithMedia === true;

  return (
    <>
      {/* Main menu panel */}
      <section
        className={clsx(
          "fixed top-0 left-0 w-full h-screen bg-[var(--grey-00)] z-50 transition-transform duration-300 ease-in-out",
          "overflow-y-auto hide-scrollbar scroll-smooth",
          isSubMenuOpen ? "translate-x-full" : "translate-x-0"
        )}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center border-b border-b-[var(--grey-3)] p-[24px_20px]">
          <img src="/icons/elova-logo.svg" alt="Elova Logo" className="h-6" />
          <img
            src="/icons/close.svg"
            onClick={() => closeMobile(false)}
            className="sm:w-4 sm:h-4 w-3 h-3 cursor-pointer"
            alt="close"
          />
        </div>

        {/* Main menu items */}
        <div className="mb-[91px]">
          {menus.map((menu, index) => (
            <a
              key={index}
              onClick={() => {
                setIsSubMenuOpen(true);
                setSelectedMainMenu({ label: menu.title });
              }}
            >
              <div className="p-[16px_20px] flex justify-between">
                {menu.title}
                <img src="/icons/right-caret.svg" />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom links */}
        {/* <a>
          <div className="p-[16px_20px] flex justify-between uppercase border-t border-t-[var(--teal-3)]">
            Book now
          </div>
        </a> */}
        <Link
          href="/book-an-appointment"
          className="p-[16px_20px] flex justify-between uppercase border-t border-t-[var(--teal-3)]"
          onClick={() => {
            setIsSubMenuOpen(false);
            closeMobile(false);
          }}
        >
          Book now
        </Link>
        <a>
          <div className="p-[16px_20px] flex justify-between uppercase border-t border-t-[var(--teal-3)]">
            Canada (CAD $) <img src="/icons/right-caret.svg" />
          </div>
        </a>
        {/* <a>
          <div className="p-[16px_20px] flex justify-between uppercase border-t border-t-[var(--teal-3)]">
            English <img src="/icons/right-caret.svg" />
          </div>
        </a> */}

        <div className="p-[16px_20px] border-t border-t-[var(--teal-3)]">
          <SocialMediaIcons
            iconColor="teal"
            imageSize={"h-[16px]"}
            icons={SOCIAL_MEDIA_ICONS}
          />
        </div>
      </section>

      {/* Submenu panel */}
      <section
        className={clsx(
          "fixed top-0 left-0 w-full !h-screen bg-[var(--grey-00)] transition-transform duration-500 ease-in-out",
          "overflow-y-auto hide-scrollbar scroll-smooth ",
          isSubMenuOpen ? "translate-x-0" : "-translate-x-100",
          selectedMainMenu ? "z-50" : "z-0"
        )}
      >
        {/* Submenu top bar */}
        <div className="flex justify-between border-b border-b-[var(--grey-3)] p-[24px_20px]">
          <div
            className="inline-flex mr-[10px] cursor-pointer"
            onClick={() => {
              setIsSubMenuOpen(false);
            }}
          >
            <img src="/icons/left-caret.svg" alt="back-icon" />
            <p>{selectedMainMenu.label}</p>
          </div>
          <img src="/icons/close.svg" onClick={() => closeMobile(false)} />
        </div>

        {isCustomize && (
          <div className="grid grid-cols-2 gap-[16px] p-[16px_20px]">
            {customizeData?.cms_page?.collection_section?.[0]?.items.map(
              (item, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/customize/?category=${item.title.toLowerCase()}`
                    );
                    setIsSubMenuOpen(false);
                    closeMobile(false);
                  }}
                >
                  <img
                    src={item.file}
                    alt={item.title}
                    className="w-full h-[140px] object-cover"
                  />
                  <p className="mt-[8px] text-center text-[12px] font-[500] uppercase">
                    {item.title}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Categories with accordion */}
        {!isCustomize &&
          subMenu?.categories?.map((category, index) => (
            <Accordion
              title={category.title}
              key={index}
              containerClass={"p-[16px_20px] !border-0"}
            >
              <div
                className={clsx(
                  "grid grid-cols-2 gap-y-[12px] bg-[var(--grey-00)] sm:px-[30px] px-[10px] overflow-hidden transition-all duration-500 max-h-[500px] py-[10px]"
                )}
              >
                {category.items?.map((item, idx) => {
                  const href =
                    typeof item.link === "string"
                      ? item.link
                      : typeof item.href === "string"
                      ? item.href
                      : subMenu.title === "About us"
                      ? "/about-us"
                      : subMenu.title === "Customize"
                      ? "/customize"
                      : "/product";

                  return (
                    <Link
                      href={href}
                      key={idx}
                      onClick={() => closeMobile(false)}
                    >
                      <p className="py-[4px] text-[var(--grey-2)]">
                        {" "}
                        {toTitleCase(item.label) || toTitleCase(item)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </Accordion>
          ))}

        {/* Image section */}
        {subMenu?.imageSection?.length > 0 &&
          subMenu.imageSection.map((section, idx) => (
            <div key={idx} className="p-[16px_20px]">
              <img
                src={section.imageUrl}
                alt={section.additionalTitle}
                className="pb-[16px] object-cover md:h-[270px] w-[301px] h-[216px]"
              />
              <h2 className="pb-[12px] text-[14px] font-[500]">
                {section.additionalTitle}
              </h2>
              <p className="pb-[20px] text-[12px] font-[400]">
                {section.additionalDescription}
              </p>
              <Button
                className="!text-[12px] font-[400]"
                title={section.callToAction?.text}
              />
            </div>
          ))}
      </section>
    </>
  );
};

export default MobileNav;
