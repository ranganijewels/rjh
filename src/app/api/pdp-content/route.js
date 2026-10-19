import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { CLAIMS, SHIPPING_BULLETS } from "@/content/policies";
import { DIFFERENCE_DEFAULT } from "@/content/brand";

// Editable content shared by every Product Detail Page — trust badges, the
// "why choose" features, the financing line, the shipping/returns + care
// accordions, and the brand pillars. Stored as a single CMS "pdp-content"
// section (pageSlug=product); these defaults are used until it's set. CORS is
// open so the CMS editor (other origin) can seed its form from the defaults.
function buildDefault() {
  return {
    trust_badges: [
      { icon: "shipping", label: CLAIMS.shipping },
      { icon: "diamond", label: CLAIMS.certification },
      { icon: "returns", label: CLAIMS.returnsShort },
      { icon: "lock", label: "Secure checkout" },
    ],
    why_choose: [
      { image: "/icons/certified.svg", service_description: "Certified Lab-Grown Diamonds" },
      { image: "/icons/lifetime-warranty.svg", service_description: "Lifetime Manufacturing Warranty" },
      { image: "/icons/ethically-sourced-materials.svg", service_description: "Hallmarked Gold & 925 Silver" },
      { image: "/icons/shipping.svg", service_description: "Free Insured Shipping" },
    ],
    shipping_returns: SHIPPING_BULLETS,
    certification_care: [
      "Gold is hallmarked for purity.",
      "Lifetime warranty against manufacturing defects.",
      "Store separately in the provided pouch; avoid contact with chemicals.",
    ],
    brand_pillars: {
      eyebrow: "The RJ House Difference",
      items: [
        { icon: "hand", title: "Crafted by hand", body: "Every piece is shaped, set and finished by our master jewelers — never mass-produced." },
        { icon: "gem", title: "Diamonds with integrity", body: "Lab-grown and ethically sourced diamonds, each graded and certified for lasting brilliance." },
        { icon: "heart", title: "Cared for", body: "A lifetime warranty against manufacturing defects — if a fault is found, we repair or replace it." },
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
    difference: DIFFERENCE_DEFAULT,
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
        "Questions about this piece, sizing, or a bespoke idea? Send us a message and our jewellery team will reply by email.",
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
      delete data.financing;
    }
  } catch {
    /* CMS unavailable — use defaults */
  }
  const out = NextResponse.json({ status: true, data });
  out.headers.set("Access-Control-Allow-Origin", "*");
  return out;
}
