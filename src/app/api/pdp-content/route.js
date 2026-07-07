import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Editable content shared by every Product Detail Page — trust badges, the
// "why choose" features, the financing line, the shipping/returns + care
// accordions, and the brand pillars. Stored as a single CMS "pdp-content"
// section (pageSlug=product); these defaults are used until it's set. CORS is
// open so the CMS editor (other origin) can seed its form from the defaults.
function buildDefault() {
  return {
    trust_badges: [
      { icon: "shipping", label: "Free insured shipping" },
      { icon: "diamond", label: "Certified diamonds" },
      { icon: "returns", label: "30-day easy returns" },
      { icon: "lock", label: "Secure checkout" },
    ],
    why_choose: [
      { image: "/icons/certified.svg", service_description: "100% Certified Conflict-Free Diamonds" },
      { image: "/icons/lifetime-warranty.svg", service_description: "Lifetime Warranty" },
      { image: "/icons/ethically-sourced-materials.svg", service_description: "Ethically Sourced Materials" },
      { image: "/icons/shipping.svg", service_description: "Free & Fast Worldwide Shipping" },
    ],
    financing: {
      enabled: true,
      months: 4,
      note: "interest-free installment plans coming soon",
    },
    shipping_returns: [
      "Complimentary insured shipping on every order, worldwide.",
      "Ready-to-ship fine jewelry dispatches in 3–4 business days.",
      "Made-to-order engagement & wedding rings ship in 4–6 weeks.",
      "Easy 30-day returns on eligible items in original condition.",
    ],
    certification_care: [
      "Each diamond is graded and accompanied by a lab certificate.",
      "Precious metals are responsibly sourced and hallmarked for purity.",
      "Complimentary cleaning & inspection at our atelier, for life.",
      "Store separately in the provided pouch; avoid contact with chemicals.",
    ],
    brand_pillars: {
      eyebrow: "The RJ House Difference",
      items: [
        { icon: "hand", title: "Crafted by hand", body: "Every piece is shaped, set and finished by our master jewelers — never mass-produced." },
        { icon: "gem", title: "Diamonds with integrity", body: "Lab-grown and ethically sourced diamonds, each graded and certified for lasting brilliance." },
        { icon: "heart", title: "Cared for, for life", body: "Complimentary cleaning, inspection and resizing at our atelier — your piece, looked after forever." },
      ],
    },
    build_your_own: {
      enabled: true,
      eyebrow: "Bespoke",
      heading: "Build a ring that's entirely yours",
      description: "Begin with a diamond or a setting and craft a one-of-a-kind piece alongside our atelier — every detail chosen by you.",
      buttonText: "Start Designing",
      buttonUrl: "/customize",
      image: "/images/customize/start-designing-online.png",
    },
    // "The RJ House Difference" — story + accordion band (Ecksand layout).
    difference: {
      heading: "The RJ House Difference",
      body:
        "When you choose Rangani Jewelry House, you become part of a tradition rooted in three generations of craftsmanship. Since 1990, each piece has been designed and handmade in our atelier. Certified by IGI and GIA, your jewel carries a legacy of sustainability, artistry, and intention.",
      linkText: "About RJ House",
      linkUrl: "/about-us",
      items: [
        { title: "Sustainable Materials", body: "Exclusively lab-grown, IGI & GIA certified diamonds set in responsibly sourced 18K and 22K gold, sterling silver, and platinum — brilliance without the footprint." },
        { title: "Certifications & Hallmarks", body: "Every diamond ships with its lab certificate, and every precious metal is hallmarked for purity — BIS hallmarked gold, always." },
        { title: "Signature Packaging", body: "Each piece arrives in our signature navy presentation box with care card and polishing cloth — ready for the moment it was made for." },
        { title: "Customer Reviews", body: "Rated by the people who wear Rangani every day — read verified reviews from proposals, anniversaries, and everything in between, right on this page." },
      ],
    },
    // "Build your own Engagement Ring" 3-up editorial columns.
    build_columns: {
      enabled: true,
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
    },
    // Ecksand-style quick-links strip (Ring Size Guide / Book / Shipping).
    quick_links: {
      enabled: true,
      items: [
        { icon: "ruler", label: "Ring Size Guide", url: "/ring-size-guide" },
        { icon: "calendar", label: "Book a Consultation", url: "/book-consultancy" },
        { icon: "shipping", label: "Complimentary Shipping", url: "/shipping" },
      ],
    },
    // "Get in touch with one of our Expert Designers" contact block —
    // submissions land in the CMS Custom Requests inbox.
    expert_contact: {
      enabled: true,
      eyebrow: "Here To Help",
      heading: "Get in touch with one of our Expert Designers",
      description:
        "Questions about this piece, sizing, or a bespoke idea? Our designers reply within one business day.",
    },
  };
}

export async function GET() {
  let data = buildDefault();
  try {
    const res = await rjApi("GET", "/cms/sections?pageSlug=product");
    const sections = res.raw?.data || res.raw || [];
    const matching = (Array.isArray(sections) ? sections : []).filter(
      (s) => s?.sectionKey === "pdp-content"
    );
    matching.sort((a, b) => new Date(b?.updatedAt || 0) - new Date(a?.updatedAt || 0));
    const content = matching[0]?.content;
    if (content && typeof content === "object") {
      // Shallow-merge so a partial CMS section still falls back per-block.
      data = { ...data, ...content };
    }
  } catch {
    /* CMS unavailable — use defaults */
  }
  const out = NextResponse.json({ status: true, data });
  out.headers.set("Access-Control-Allow-Origin", "*");
  return out;
}
