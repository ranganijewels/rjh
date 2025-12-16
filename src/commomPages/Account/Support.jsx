"use client";
import Typography from "@/components/ui/Typography/Typography";
import React from "react";

const Support = ({ showHeading }) => {
  return (
    <>
      {showHeading && (
        <div className="xl:mb-[50px] mb-[30px]">
          <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
            Support
          </p>
        </div>
      )}

      <div className="md:p-[36px_38px] p-4 flex lg:flex-row flex-col lg:items-center items-start lg:gap-0 gap-[30px] bg-[var(--product-bg)]">
        <div className="flex-1 lg:space-y-[24px] space-y-[12px]">
          <p className="lg:text-[24px] text-[18px] font-[500]">Call Us</p>

          <div className="space-y-[10px]">
            <Typography variant="h5" className="font-[500]">
              Contact our support team
            </Typography>
            <Typography variant="h5" className="font-[500]" textColor="teal">
              040-671151631
            </Typography>
            <Typography variant="h5">
              Monday to Saturday 9:00 am - 7:00 pm.
            </Typography>
          </div>
        </div>

        <hr className="px-16 border lg:rotate-90 border-[var(--teal-3)] lg:w-auto w-full" />
        <div className="flex-1 lg:space-y-[24px] space-y-[12px]">
          <p className="lg:text-[24px] text-[18px] font-[500]">Email Us</p>

          <div className="space-y-[14px]">
            <Typography variant="h5">
              Email us to get support from our team
            </Typography>
            <Typography
              variant="h5"
              className="font-[500] cursor-pointer hover:underline"
              textColor="teal"
              onClick={() =>
                (window.location.href = "mailto:info@elovajewel.com")
              }
            >
              info@elovajewel.com
            </Typography>

            <Typography variant="h5">Hours: 24x7</Typography>
            {/* <div className="space-x-[20px] space-y-[10px]">
              <Button title={"Start chatting"} />
              <Button title={"email us"} variant="outlineTeal" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
