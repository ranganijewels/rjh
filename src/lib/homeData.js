import { rjApi } from "@/lib/apiHandler";

const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

function sectionsByKey(sections) {
  const m = {};
  for (const s of sections) m[s.sectionKey] = s.content || {};
  return m;
}

// Homepage content (CMS sections → storefront shape). Used by the server-rendered
// homepage and by GET /api/home for client components.
export async function buildHomeData() {
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
    const reviewSection = s["customer-reviews"] || {};
    const reviews = {
      ...reviewSection,
      // Owner decision (2026-10): show all entries; provenance is tracked in
      // the Studio fields and the owner is replacing these entries manually.
      reviews: (reviewSection.reviews || []).filter(Boolean),
    };
    const promo = s["promo-banner"] || {};
    const footer = s["footer"] || {};
    const topHeader = s["top-header"] || {};
    // Reels added by hand in CMS Studio ▸ Instagram Reels (no Instagram login needed).
    const reelsSection = s["instagram-reels"] || {};
    const manualReels = (reelsSection.items || [])
      .filter((r) => r && r.media)
      .map((r, i) => ({ id: `reel-${i + 1}`, file: r.media, thumbnail: r.thumbnail || "", link: r.link || "", name: r.caption || "", review: r.caption || "" }));

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
        cta_text: whyChoose.cta1Text || whyChoose.cta1_text || "Learn More",
        cta_link: whyChoose.cta1Link || whyChoose.cta1_link || "/about-us",
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
          { image: "/icons/shipping.svg", title: "Free Shipping", service_description: "Free insured shipping on every order" },
          { image: "/icons/certified.svg", title: "Certified Diamonds", service_description: "IGI/GIA reports for solitaires, SGL certificates for jewellery" },
          { image: "/icons/lifetime-warranty.svg", title: "Lifetime Warranty", service_description: "Against manufacturing defects" },
          { image: "/icons/easy-returns.svg", title: "Easy Returns", service_description: "14-day returns on eligible items" },
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
          // Hand-added reels win; until some exist, fall back to the customer-photo
          // entries so the strip is never empty.
          loved_by_items: manualReels.length
            ? manualReels
            : (reviews.reviews || [])
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

    return homeData;
  } catch (e) {
    return null;
  }
}
