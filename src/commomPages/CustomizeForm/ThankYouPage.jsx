"use client";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import { useCustomize } from "@/context/CustomizeContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";

const ThankYouPage = () => {
  const { clearReferenceForm } = useCustomize();
  const router = useRouter();

  useEffect(() => {
    clearReferenceForm();
  }, []);

  return (
    <section>
      <div
        className={`xl:mt-[60px] md:mt-[40px] mt-[30px] 2xl:mx-[210px] xl:mx-[100px] md:mx-[40px] mx-[0px] bg-white`}
      >
        <div className="lg:py-[80px] py-[40px] xl:px-[80px] lg:px-[37px] px-[18px] flex flex-col items-center text-center">
          <Image
            src="/icons/success-icon.svg"
            alt="Success"
            width={128}
            height={128}
            className="w-[128px] h-[128px] mb-[75px]"
          />

          <div>
            <Typography as="h1" variant="h2" className="mb-[16px]">
              Thank You!
            </Typography>
            <Typography
              variant="h4"
              textColor="placeholder"
              className="mb-[10px]"
            >
              Your custom jewelry request has been received.
            </Typography>
            <Typography variant="h5" className="mb-[50px]">
              One of our jewelry consultants will contact you soon to guide you
              through the design process.
            </Typography>
          </div>
          <Button
            title={"back to home"}
            onClick={() => router.push("/")}
          />
        </div>
      </div>
    </section>
  );
};

export default ThankYouPage;
