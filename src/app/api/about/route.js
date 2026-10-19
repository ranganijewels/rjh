import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

const NEST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Rich defaults so the page always renders complete; CMS sections on
// pageSlug=about-us (keys: hero-banner / explore / services / testimonials /
// cta-banner) override any part of this.
const DEFAULTS = {
  hero_section: [
    {
      title: "Crafted with Conscience, Worn with Pride",
      subtitle:
        "Rangani Jewelry House creates certified lab grown diamond jewelry — ethical brilliance, heirloom craftsmanship, honest prices.",
      file: "/images/about-us-banner.png",
      buttons: [
        { title: "Explore the Collection", link: "/product" },
        { title: "Book a Consultation", link: "/book-consultancy" },
      ],
    },
  ],
  explore: [
    {
      title: "Our Story",
      description:
        "Our family has worked with diamonds for more than 50 years — first in natural diamond manufacturing, then growing and cutting our own lab-grown diamonds, and today making fine jewellery in 10K, 14K and 18K gold and 925 sterling silver.",
      file: `${NEST}/uploads/product-media/traditional-solitaire-engagement-ring-yellowgold-labgrowndiamond-ovalcut-1.00ct-002-web.avif`,
      quote: "Jewelry should carry a story — yours, and the story of how it was made.",
    },
    {
      title: "Lab Grown, Beyond Compare",
      description:
        "Our diamonds are grown above ground with a fraction of the footprint of mining — chemically, optically and physically identical to mined stones, and hand-selected for cut, colour and clarity. Solitaire centre stones come with an IGI or GIA report; jewellery set with smaller diamonds comes with an SGL certificate.",
      file: `${NEST}/uploads/product-media/nirvana-engagement-ring-whitegold-labgrowndiamond-pearcut-1.00ct-002-web.avif`,
      quote: "The same fire. The same forever. A far kinder origin.",
    },
  ],
  service_section: [
    {
      headtitle: "The Rangani Standard",
      description: "Every piece, every order, every time.",
      service_items: [
        { icon: "/icons/certified.svg", title: "Certified Diamonds", service_description: "IGI/GIA for solitaires, SGL for jewellery" },
        { icon: "/icons/lifetime-warranty.svg", title: "Lifetime Warranty", service_description: "Against manufacturing defects" },
        { icon: "/icons/shipping.svg", title: "Free Insured Shipping", service_description: "Tracked and fully insured" },
        { icon: "/icons/diamond.svg", title: "Ethically Sourced", service_description: "Lab grown, responsibly made" },
        { icon: "/icons/earth.svg", title: "Hallmarked Metals", service_description: "10K, 14K & 18K gold, 925 silver" },
        { icon: "/icons/leaf.svg", title: "Sustainable at Heart", service_description: "A fraction of mining's footprint" },
      ],
    },
  ],
  testimonial_section: [
    {},
    {
      title: "Loved by Our Customers",
      description: "Real words from people who wear Rangani every day.",
    },
  ],
  banner_section: [
    {
      title: "Begin Your Forever",
      description:
        "Design a ring that's unmistakably yours — choose the diamond, the metal, the story.",
      bg_file: "/images/home/book-a-virtual-appointment.png",
      buttons: [{ title: "Start Customizing", link: "/customize" }],
    },
  ],
};

export async function GET() {
  try {
    const result = await rjApi("GET", "/cms/sections?pageSlug=about-us");
    const sections = result.raw?.data || [];
    const byKey = {};
    for (const s of sections) byKey[s.sectionKey] = s.content || {};

    const hero = byKey["hero-banner"] || byKey["hero"] || {};
    const data = {
      ...DEFAULTS,
      hero_section: [
        {
          ...DEFAULTS.hero_section[0],
          ...(hero.heading ? { title: hero.heading } : {}),
          ...(hero.subHeading ? { subtitle: hero.subHeading } : {}),
          ...(hero.videoUrl || hero.imageUrl
            ? { file: hero.videoUrl || hero.imageUrl }
            : {}),
        },
      ],
      ...(Array.isArray(byKey["explore"]?.items) && byKey["explore"].items.length
        ? { explore: byKey["explore"].items }
        : {}),
      ...(Array.isArray(byKey["services"]?.service_items) &&
      byKey["services"].service_items.length
        ? {
            service_section: [
              {
                headtitle: byKey["services"].heading || DEFAULTS.service_section[0].headtitle,
                description: byKey["services"].subHeading || "",
                service_items: byKey["services"].service_items,
              },
            ],
          }
        : {}),
      ...(byKey["cta-banner"] &&
      (byKey["cta-banner"].heading || byKey["cta-banner"].bg_file || byKey["cta-banner"].imageUrl)
        ? {
            banner_section: [
              {
                title: byKey["cta-banner"].heading || DEFAULTS.banner_section[0].title,
                description: byKey["cta-banner"].subHeading || DEFAULTS.banner_section[0].description,
                bg_file:
                  byKey["cta-banner"].bg_file ||
                  byKey["cta-banner"].imageUrl ||
                  DEFAULTS.banner_section[0].bg_file,
                buttons: byKey["cta-banner"].cta1Text
                  ? [{ title: byKey["cta-banner"].cta1Text, link: byKey["cta-banner"].cta1Link || "/customize" }]
                  : DEFAULTS.banner_section[0].buttons,
              },
            ],
          }
        : {}),
    };

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: DEFAULTS });
  }
}
