import Image from "next/image";
import PaymentOptions from "@/components/ui/PaymentOptions.jsx/PaymentOptions";
import { FOOTER_MENUS } from "./constant";
import Typography from "@/components/ui/Typography/Typography";
import clsx from "clsx";

const Footer = () => {
  return (
    <footer className="xl:pt-[54px] pt-[40px] text-[var(--teal-1)]">
      <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 2xl:gap-[131px] lg:gap-[70px] md:gap-[48px] gap-[24px] xl:pb-[36px] pb-[18px] xl:px-[70px] lg:px-[37px] px-[18px]">
        {/* Logo */}
        <div className="md:col-span-1 col-span-2">
          <Image
            src="/logo/rj-house.svg"
            alt="RJ House Logo"
            width={198}
            height={100}
            className="xl:w-[198px] xl:h-[100px] lg:w-[130px] lg:h-[60px] md:w-[135px] md:h-[65px] w-[140px] h-[70px]"
          />
        </div>

        {/* Menu Sections */}
        {FOOTER_MENUS.map((section) => (
          <div
            key={section.title}
            className="flex xl:gap-[10px] lg:gap-[10px] flex-col"
          >
            <Typography
              variant="h6"
              className="font-[500] xl:mb-[14px] lg:mb-[8px]"
              textColor="teal"
            >
              {section.title}
            </Typography>
            {section.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)]"
              >
                <span
                  className={clsx(
                    "relative inline-block px-[8px] py-[4px] xl:text-[14px] text-[12px] font-[400]",
                    "after:content-[''] after:block after:absolute after:left-0 after:bottom-0",
                    "after:h-[1px] after:w-full after:bg-[var(--teal-1)]",
                    "after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out",
                    "hover:after:scale-x-100 focus:after:scale-x-100 active:after:scale-x-100"
                  )}
                >
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
      <hr className="hr-teal-1" />
      <div className="flex md:flex-row flex-col md:justify-between gap-[20px] items-center xl:py-[25px] py-[11px] xl:px-[70px] px-[18px] ">
        <p className="xl:text-[14px] font-[400] text-[10px]">
          @{new Date().getFullYear()} RJ House. All Rights Reserved
        </p>
        <PaymentOptions />
      </div>
    </footer>
  );
};

export default Footer;
