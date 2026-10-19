"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DIFFERENCE_DEFAULT } from "@/content/brand";

// "The RJ House Difference" — Ecksand-style two-column band: brand story +
// ABOUT link on the left, an accordion stack (materials / certification /
// packaging / reviews) on the right. Copy is CMS-driven via pdp-content
// `difference`; the defaults below render until it's edited.
const DEFAULTS = DIFFERENCE_DEFAULT;

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
