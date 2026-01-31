import PaymentOptions from "@/components/ui/PaymentOptions.jsx/PaymentOptions";
import { FOOTER_MENUS } from "./constant";
import Typography from "@/components/ui/Typography/Typography";
import clsx from "clsx";

const Footer = () => {
  return (
    <footer className="xl:pt-[54px] pt-[40px] text-[#204F59]">
      <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 2xl:gap-[131px] lg:gap-[70px] gap-[48px] xl:pb-[36px] pb-[18px] xl:px-[70px] lg:px-[37px] px-[18px]">
        {/* Logo */}
        <div className="md:col-span-1 col-span-2">
          <img
            src="/logo/elova-jewel-footer.png"
            alt="Elova Logo"
            className="xl:w-[198px] xl:h-[100px] lg:w-[130px] lg:h-[60px] w-[140px] h-[70px]"
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
              <a key={idx} href={link.url}>
                <span
                  className={clsx(
                    "relative inline-block xl:text-[14px] text-[12px] font-[400]",
                    "after:content-[''] after:block after:absolute after:left-0 after:bottom-0",
                    "after:h-[1px] after:w-full after:bg-[var(--teal-1)]",
                    "after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out",
                    "hover:after:scale-x-100"
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
      <div className="flex md:flex-row flex-col md:justify-between gap-[20px] items-center xl:py-[25px] py-[11px] xl:px-[70px] px-[37px] ">
        <label className="xl:text-[14px] font-[400] text-[10px]">
          @2026 Elova. All Rights Reserved
        </label>
        <PaymentOptions />
      </div>
    </footer>
  );
};

export default Footer;
