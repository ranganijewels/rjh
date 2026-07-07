"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";

// Ecksand-style "Build your own" editorial CTA — a full-bleed image banner with
// a quiet-luxury headline and a single call to the customize journey. Content is
// CMS-driven via the pdp-content section (`build_your_own`); these are defaults.
const DEFAULT = {
  enabled: true,
  eyebrow: "Bespoke",
  heading: "Build a ring that's entirely yours",
  description:
    "Begin with a diamond or a setting and craft a one-of-a-kind piece alongside our atelier — every detail chosen by you.",
  buttonText: "Start Designing",
  buttonUrl: "/customize",
  image: "/images/customize/start-designing-online.png",
};

export default function BuildYourOwn({ content }) {
  const router = useRouter();
  const c = { ...DEFAULT, ...(content || {}) };
  if (c.enabled === false) return null;

  return (
    <section className="md:px-[30px] px-[18px]">
      <div className="relative overflow-hidden rounded-[14px] min-h-[340px] md:min-h-[440px] flex items-center">
        {c.image ? (
          <Image
            src={c.image}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--teal-1)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/50 to-black/40 lg:bg-gradient-to-r lg:from-black/55 lg:via-black/30 lg:to-black/5" />
        <div className="relative px-[24px] md:px-[64px] py-[44px] max-w-[580px]">
          {c.eyebrow ? (
            <p className="text-[11px] md:text-[12px] tracking-[0.24em] uppercase text-white/80 mb-[14px]">
              {c.eyebrow}
            </p>
          ) : null}
          <h2
            className="text-white text-[28px] md:text-[40px] leading-[1.12] mb-[16px]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500 }}
          >
            {c.heading}
          </h2>
          {c.description ? (
            <p className="text-white/85 text-[14px] md:text-[16px] leading-relaxed mb-[26px] max-w-[440px]">
              {c.description}
            </p>
          ) : null}
          <Button
            title={c.buttonText || "Start Designing"}
            onClick={() => router.push(c.buttonUrl || "/customize")}
            className="!py-[12px] !px-[24px] min-h-[44px]"
          />
        </div>
      </div>
    </section>
  );
}
