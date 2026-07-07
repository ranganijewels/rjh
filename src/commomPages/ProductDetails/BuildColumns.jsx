"use client";

import React from "react";
import Link from "next/link";

// Ecksand-style "Build your own Engagement Ring" 3-up editorial: left-aligned
// serif heading, three image columns each with an uppercase title, supporting
// copy, and an underlined link. CMS-driven via pdp-content `build_columns`.
const DEFAULTS = {
  heading: "Build your own Engagement Ring",
  items: [
    {
      image: "/images/customize/start-designing-online.png",
      title: "Personalized Engagement Rings",
      text: "Ring settings, metal finishes, and center diamonds converge in an interactive design journey tailored for exactitude — every detail chosen to personal preference.",
      linkText: "Learn More",
      linkUrl: "/customize",
    },
    {
      image: "/images/customize/cut-clarity.png",
      title: "Diamonds With Integrity",
      text: "Certified conflict-free lab-grown diamonds deliver uncompromising brilliance. Each gem meets exacting standards for cut, color and clarity, with provenance traceable from source to setting.",
      linkText: "About Our Diamonds",
      linkUrl: "/diamond-education",
    },
    {
      image: "/images/customize/custom-engravings.png",
      title: "The RJ House Atelier",
      text: "Every ring is shaped by seasoned artisans where time-honored techniques meet exacting quality control. From hand-forged bands to precision stone setting, each element reflects a lineage of craftsmanship.",
      linkText: "About Our Atelier",
      linkUrl: "/craftsmanship",
    },
  ],
};

export default function BuildColumns({ config }) {
  if (config && config.enabled === false) return null;
  const heading = config?.heading || DEFAULTS.heading;
  const items = config?.items?.length ? config.items : DEFAULTS.items;

  return (
    <section className="md:px-[30px] px-[18px]">
      <h2 className="font-[var(--font-cormorant)] text-[28px] md:text-[36px] font-medium leading-[1.15] text-[var(--grey-2)] mb-[28px] md:mb-[36px]">
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] md:gap-[40px]">
        {items.map((item, i) => (
          <div key={i}>
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-[3/2] object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-[14px] md:text-[15px] font-[600] uppercase tracking-[0.06em] text-[var(--grey-2)] mt-[22px]">
              {item.title}
            </h3>
            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[var(--placeholder)] mt-[10px]">
              {item.text}
            </p>
            {item.linkText && (
              <Link
                href={item.linkUrl || "#"}
                className="inline-block mt-[14px] text-[12px] uppercase tracking-[0.12em] underline underline-offset-[6px] text-[var(--grey-2)] hover:text-[var(--teal-1)] transition-colors"
              >
                {item.linkText}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
