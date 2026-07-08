import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

const enc = (s) => s.replace(/&/g, "%26").replace(/#/g, "%23");
const svgIcon = (path) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232F6F7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${enc(path)}</svg>`;

const TRUCK_PATH = "<rect x='1' y='3' width='15' height='13'></rect><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'></polygon><circle cx='5.5' cy='18.5' r='2.5'></circle><circle cx='18.5' cy='18.5' r='2.5'></circle>";
const GEM_PATH = "<polyline points='6 3 18 3 22 9 12 22 2 9 6 3'></polyline><line x1='12' y1='22' x2='12' y2='9'></line><line x1='2' y1='9' x2='22' y2='9'></line>";
const SHIELD_PATH = "<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>";
const RETURNS_PATH = "<polyline points='1 4 1 10 7 10'></polyline><path d='M3.51 15a9 9 0 1 0 .49-3.59'></path>";

const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

function sectionsByKey(sections) {
  const m = {};
  for (const s of sections) m[s.sectionKey] = s.content || {};
  return m;
}

export async function GET(req) {
  try {
    const result = await rjApi("GET", `/cms/sections?pageSlug=homepage`);
    const sections = result.raw?.data || [];
    const s = sectionsByKey(sections);

    const hero = s["hero-banner"] || s["hero"] || {};
    const featured = s["featured-collection"] || {};
    const variants = s["product-variants"] || {};
    const whyChoose = s["why-choose"] || {};
    const discover = s["discover-styles"] || {};
    const newsletter = s["newsletter"] || {};
    const reviews = s["customer-reviews"] || {};
    const promo = s["promo-banner"] || {};
    const footer = s["footer"] || {};
    const topHeader = s["top-header"] || {};

    const homeData = {
      hero_section: [{
        title: hero.heading || "Exquisite Fine Jewelry Collection",
        subtitle: hero.subHeading || "Discover timeless elegance",
        // A hero video (CMS "Hero video" upload) takes priority over the image
        file: hero.videoUrl || hero.imageUrl || "",
        mobile_file: hero.mobileVideoUrl || hero.mobileImageUrl || hero.videoUrl || hero.imageUrl || "",
        // Still-image poster shown before/while the video plays (or when
        // reduced-motion holds it) — only use it if it's actually an image
        // (a .mov/.mp4 uploaded into imageUrl would not render as a poster).
        poster: (() => {
          const img = hero.imageUrl || hero.mobileImageUrl || "";
          return /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(img) ? img : "";
        })(),
        buttons: [
          { title: hero.cta1Text || "Shop Now", link: hero.cta1Link || "/product", variant: hero.cta1Style || "primary" },
          { title: hero.cta2Text || "Explore Collections", link: hero.cta2Link || "/product", variant: hero.cta2Style || "outlineWhite" },
        ],
      }],

      collection_section: [{
        section_title: featured.heading || "Featured Collections",
        sub_title: featured.subHeading || "Timeless Elegance, Crafted for You",
        items: (featured.banners || []).map((b, i) => ({
          id: i + 1,
          category_id: null,
          file: b.imageUrl || null,
          image: b.imageUrl || null,
          title: b.text || "",
          link: b.link || "/product",
        })),
      }],

      diamond_icon_shape: [{
        heading: variants.heading || "Personalized Shopping Experience",
        shapes: (variants.banners || []).map((b, i) => ({
          id: i + 1,
          shape_id: b.text || "",
          icon_title: b.text || "",
          icon_image: b.imageUrl || null,
          image: b.imageUrl || null,
          link: b.link || "/product",
        })),
        buttons: [
          { button_text: "Explore Diamonds", button_url: "/product", button_color: "", button_border: "" },
        ],
      }],

      why_choose_section: [{
        heading: whyChoose.heading || "Why Choose RJ House",
        sub_heading: whyChoose.subHeading || "",
        video_url: whyChoose.videoUrl || "",
        items: (whyChoose.features || []).map(f => ({
          icon: f.icon || "✨",
          title: f.title || "",
          description: f.description || "",
        })),
      }],

      discover_styles: {
        heading: discover.heading || "Discover Styles",
        subHeading:
          discover.subHeading ||
          "Discover diverse engagement ring styles, each embodying a distinct symbol of love and devotion",
        styles: (discover.styles || discover.banners || [])
          .filter((st) => st.imageUrl)
          .map((st) => ({
            imageUrl: st.imageUrl,
            title: st.title || st.text || "",
            description: st.description || "",
            link: st.link || "/product",
          })),
      },

      service_section: [{
        service_items: [
          { image: svgIcon(TRUCK_PATH), title: "Free Shipping", service_description: "Free insured shipping worldwide" },
          { image: svgIcon(GEM_PATH), title: "Certified Diamonds", service_description: "IGI & GIA certified stones" },
          { image: svgIcon(SHIELD_PATH), title: "Lifetime Warranty", service_description: "On all our jewelry" },
          { image: svgIcon(RETURNS_PATH), title: "Easy Returns", service_description: "30-day hassle-free returns" },
        ],
      }],

      banner_section: [{
        // Promo banner — fully CMS-editable via Homepage → Promo Banner.
        title: promo.heading || "Your Dream Jewelry Awaits",
        description:
          promo.subHeading ||
          "Crafted with passion, worn with pride. Explore our exclusive collection of fine jewelry.",
        bg_file: promo.videoUrl || promo.imageUrl || hero.imageUrl || "",
        buttons: [
          { button_text: promo.cta1Text || "Shop Now", button_url: promo.cta1Link || "/product", button_color: "", button_border: "" },
          { button_text: promo.cta2Text || "Customize", button_url: promo.cta2Link || "/customize", button_color: "transparent", button_border: "1px solid white" },
        ],
      }],

      loved_by_section: [
        null,
        {
          title: "As Seen on Instagram",
          loved_by_items: (reviews.reviews || [])
            .filter(r => r.imageUrl)
            .map((r, i) => ({
              id: i + 1,
              file: r.imageUrl,
              name: r.text || "Happy Customer",
              rating: r.rating || 5,
              review: r.description || "",
            })),
        },
      ],

      testimonial_section: [{
        section_title: reviews.heading || "Customer Reviews",
        sub_title: reviews.subHeading || "",
        reviews: (reviews.reviews || []).map((r, i) => ({
          id: i + 1,
          image: r.imageUrl || "",
          name: r.text || "Happy Customer",
          rating: r.rating || 5,
          review: r.description || "",
        })),
      }],

      announcement_bar: topHeader.text || "",
    };

    return NextResponse.json({ data: homeData });
  } catch (e) {
    return NextResponse.json({ data: {} }, { status: 500 });
  }
}
