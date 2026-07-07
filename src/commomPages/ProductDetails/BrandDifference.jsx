"use client";

import React, { useState } from "react";
import Link from "next/link";

// "The RJ House Difference" — Ecksand-style two-column band: brand story +
// ABOUT link on the left, an accordion stack (materials / certification /
// packaging / reviews) on the right. Copy is CMS-driven via pdp-content
// `difference`; the defaults below render until it's edited.
const DEFAULTS = {
  heading: "The RJ House Difference",
  body:
    "When you choose Rangani Jewelry House, you become part of a tradition rooted in three generations of craftsmanship. Since 1990, each piece has been designed and handmade in our atelier. Certified by IGI and GIA, your jewel carries a legacy of sustainability, artistry, and intention.",
  linkText: "About RJ House",
  linkUrl: "/about-us",
  items: [
    {
      title: "Sustainable Materials",
      body:
        "Exclusively lab-grown, IGI & GIA certified diamonds set in responsibly sourced 18K and 22K gold, sterling silver, and platinum — brilliance without the footprint.",
    },
    {
      title: "Certifications & Hallmarks",
      body:
        "Every diamond ships with its lab certificate, and every precious metal is hallmarked for purity — BIS hallmarked gold, always.",
    },
    {
      title: "Signature Packaging",
      body:
        "Each piece arrives in our signature navy presentation box with care card and polishing cloth — ready for the moment it was made for.",
    },
    {
      title: "Customer Reviews",
      body:
        "Rated by the people who wear Rangani every day — read verified reviews from proposals, anniversaries, and everything in between, right on this page.",
    },
  ],
};

export default function BrandDifference({ config }) {
  const c = config && Object.keys(config).length ? config : {};
  const heading = c.heading || DEFAULTS.heading;
  const body = c.body || DEFAULTS.body;
  const linkText = c.linkText || DEFAULTS.linkText;
  const linkUrl = c.linkUrl || DEFAULTS.linkUrl;
  const items = Array.isArray(c.items) && c.items.length ? c.items : DEFAULTS.items;
  const [open, setOpen] = useState(-1);

  return (
    <section className="md:px-[30px] px-[18px]">
      <div className="bg-[var(--grey-00)] py-[44px] md:py-[64px] px-[20px] md:px-[56px]">
        <div className="flex flex-col lg:flex-row gap-[36px] lg:gap-[72px]">
          {/* Left — brand story */}
          <div className="lg:w-[42%] w-full lg:py-[8px]">
            <h2 className="font-[var(--font-cormorant)] text-[28px] md:text-[34px] font-medium leading-[1.15] text-[var(--grey-2)]">
              {heading}
            </h2>
            <p className="text-[14px] md:text-[15px] leading-[1.85] text-[var(--grey-2)] mt-[18px]">
              {body}
            </p>
            <Link
              href={linkUrl}
              className="inline-block mt-[22px] text-[12px] uppercase tracking-[0.12em] underline underline-offset-[6px] text-[var(--grey-2)] hover:text-[var(--teal-1)] transition-colors"
            >
              {linkText}
            </Link>
          </div>

          {/* Right — accordion cards (Ecksand layout) */}
          <div className="lg:w-[58%] w-full space-y-[14px]">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-[24px] md:px-[30px] py-[22px] text-left"
                  >
                    <span className="text-[13px] md:text-[14px] uppercase tracking-[0.12em] text-[var(--grey-2)]">
                      {item.title}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-[16px] h-[16px] shrink-0 text-[var(--grey-2)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <p className="px-[24px] md:px-[30px] pb-[22px] text-[13.5px] md:text-[14px] leading-[1.8] text-[var(--placeholder)]">
                      {item.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
