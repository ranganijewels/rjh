"use client";
import { useState } from "react";
import React from "react";
import Button from "../../components/ui/Button/Button";
import SocialMediaIcons from "../../components/ui/SocialMediaIcons/SocialMediaIcons";
import { SOCIAL_MEDIA_ICONS } from "@/constants/constant";
import { useCrudApi } from "@/hooks/useCrudApi";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const { create } = useCrudApi("/api/subscribe");

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await create({ email }, { normalizeError: true });

      if (res.status) {
        toast.success("Subscription Created");
        setEmail("");
      } else {
        const errorMsg =
          res.error?.email?.[0] || res.message || "Something went wrong";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const apiErrors = err?.errors;

      if (apiErrors) {
        setError(apiErrors);
        toast.error(apiErrors?.email?.[0]);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  return (
    <section className="bg-[var(--grey-1)] py-[22px] flex flex-col justify-start items-center xl:gap-[41px] gap-[21px]">
      <div className="text-center text-[var(--grey-2)] xl:text-[22px] text-[12px] font-[500] tracking-tight">
        Get <span className="text-[var(--teal-1)]">10% </span> off on your first
        order
      </div>
      <div className="self-stretch flex flex-col justify-start items-start xl:gap-[12px] gap-[6px] mx-auto">
        <p className="justify-start text-[var(--grey-2)] xl:text-[16px] text-[10px] font-normal tracking-tight">
          Subscribe to our newsletter
        </p>
        <div className="flex flex-wrap">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="justify-start xl:w-[510px] w-[198px] xl:h-[52px] h-[28px] text-[var(--placeholder)] xl:text-[16px] text-[14px] font-[400] tracking-tight bg-[#FFFFFF] p-[11px_20px] focus-visible:border-transparent focus-visible:outline-none focus:ring-0"
            placeholder="Enter email address*"
          />

          <Button
            title="SIGN UP"
            className="xl:h-[52px] h-[28px]"
            onClick={handleSubmit}
          />
        </div>
        {error && <p className="text-[10px] text-red-600">{error?.email[0]}</p>}

        <div className="xl:text-[14px] text-[10px] font-[400] text-[var(--placeholder)] ">
          Your privacy matters. For details, see our 
          <a
            href="/static-page/privacy-policy"
            className="underline cursor-pointer"
            aria-label="Read our Privacy Policy"
          >
            Privacy Policy.
          </a>
        </div>
      </div>

      <div className="xl:text-[14px] text-[10px] font-[400] text-[var(--grey-2) flex xl:gap-[26px] gap-[13px]">
        Follow Us:
        <SocialMediaIcons iconColor="black" icons={SOCIAL_MEDIA_ICONS} />
      </div>
    </section>
  );
};

export default Newsletter;
