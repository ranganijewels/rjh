"use client";
import React, { useEffect } from "react";
import Stepper from "@/components/ui/Stepper/Stepper";
import { usePathname } from "next/navigation";

const steps = [
  {
    title: "Reference and Customize",
    path: "/customize/reference-and-customize",
  },
  {
    title: "Review Your Selections",
    path: "/customize/review-your-selections",
  },
  { title: "Contact Information", path: "/customize/contact-information" },
];

const CustomizeForm = ({ children }) => {
  const pathname = usePathname();
  
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <section>
      <div
        className={`xl:mt-[60px] md:mt-[40px] mt-[30px] 2xl:mx-[210px] xl:mx-[100px] md:mx-[40px] mx-[0px] bg-white`}
      >
        <div className="lg:py-[80px] py-[40px] xl:px-[80px] lg:px-[37px] px-[18px]">
          {/* Cart Items */}
          <Stepper steps={steps} currentPath={pathname} />
          {children}
        </div>
      </div>
    </section>

    // <section>
    //   <HeroSection
    //     backgroundIsVideo
    //     backgroundUrl={"/videos/customize-form-banner.mov"}
    //     containerClass={"xl:h-[475px] lg:h-[326px] h-[418px]"}
    //     imageClass={"xl:h-[475px] lg:h-[326px] h-[418px] object-right"}
    //     title={"Design Your Own Masterpiece"}
    //     description={
    //       "Create a one-of-a-kind piece as unique as your story — crafted by RJ HOUSE's master artisans."
    //     }
    //   />

    //   <StepperForm />
    // </section>
  );
};

export default CustomizeForm;
