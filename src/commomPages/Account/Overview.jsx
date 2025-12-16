"use client";
import Typography from "@/components/ui/Typography/Typography";
import React, { useEffect } from "react";
import { OVERVIEW_DETAILS } from "./constant";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toTitleCase } from "@/utils/string";

const Overview = () => {
  const router = useRouter();
  const customer = useSelector((state) => state.auth.customer);

  return (
    <>
      <div className="xl:mb-[50px] mb-[30px]">
        <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)]">
          Welcome back,&nbsp;
          <span className="text-[var(--teal-1)]">
            {toTitleCase(customer?.first_name)}{" "}
            {toTitleCase(customer?.last_name)}
          </span>
        </p>
        <Typography variant="p">
          Ready to create your next timeless piece?
        </Typography>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-6">
        {OVERVIEW_DETAILS.map((item, index) => (
          <div
            key={index}
            className="py-[20px] xl:px-[45px] px-[18px] p-[20px_45px] flex flex-col gap-[24px] items-center border border-[var(--teal-3)] cursor-pointer"
            onClick={() => item?.path && router.push(item?.path)}
          >
            <img
              src={item?.icon}
              className="xl:w-[76px] xl:h-[76px] 2xl:w-[96px] 2xl:h-[96px] w-[51px] h-[51px]"
            />
            <div className="text-center">
              <Typography variant="h4" className="!font-[600] mb-[10px]">
                {item?.title}
              </Typography>
              <Typography variant="h4" className="!font-[500]">
                {item?.subTitle}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Overview;
