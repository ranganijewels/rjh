"use client";
import HeroSection from "@/components/common/HeroSection";
import React, { useEffect } from "react";
import StepperForm from "./StepperForm";

const CustomizeForm = () => {
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
      <HeroSection
        backgroundIsVideo
        backgroundUrl={"/videos/customize-form-banner.mov"}
        containerClass={"xl:h-[475px] lg:h-[326px] h-[418px]"}
        imageClass={"xl:h-[475px] lg:h-[326px] h-[418px] object-right"}
        title={"Design Your Own Masterpiece"}
        description={
          "Create a one-of-a-kind piece as unique as your story — crafted by ELOVA's master artisans."
        }
      />

      <StepperForm />
    </section>
  );
};

export default CustomizeForm;
