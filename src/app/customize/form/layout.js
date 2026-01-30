"use client";
import { usePathname } from "next/navigation";
import Stepper from "@/components/ui/Stepper/Stepper";
import { useEffect } from "react";
import { CustomizeProvider } from "@/context/CustomizeContext";

const steps = [
  {
    title: "Reference and Customize",
    matchPaths: ["/customize/form/reference"],
  },
  {
    title: "Review Your Selections",
    matchPaths: ["/customize/form/review"],
  },
  {
    title: "Contact Information",
    matchPaths: ["/customize/form/contact"],
  },
];

export default function CustomizeFormLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  return (
    <CustomizeProvider>
    <section>
      <div className="xl:mt-[60px] md:mt-[40px] mt-[30px] 2xl:mx-[210px] xl:mx-[100px] md:mx-[40px] bg-white">
        <div className="lg:py-[80px] py-[40px] xl:px-[160px] lg:px-[40px] px-[18px]">
          <Stepper steps={steps} currentPath={pathname} />
          {children}
        </div>
      </div>
    </section>
    </CustomizeProvider>
  );
}
