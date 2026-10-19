import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { marketingFromRequest } from "@/lib/marketingServer";
import {
  CRAFTING_YOUR_VISION,
  QUESTIONS,
} from "@/commomPages/Customize/constant";

// Past-project gallery entries are client work: only show ones the CMS editor
// has marked as a real project published with the client's permission.
const verifiedCreations = (items) =>
  (Array.isArray(items) ? items : []).filter((g) => g && g.consent === true && (g.image || g.imageUrl));

// Build the "Design Guides" cards from real, published Blog Posts in the chosen
// categories (a blog's category = its tag). Empty categories = all recent posts.
async function buildGuidesFromBlog(categories) {
  try {
    const res = await rjApi("GET", "/cms/blogs");
    let blogs = res.raw?.data || res.raw || [];
    if (!Array.isArray(blogs)) return [];
    blogs = blogs.filter((b) => b.isPublished !== false);
    const wanted = (categories || [])
      .map((c) => String(c).toLowerCase())
      .filter(Boolean);
    if (wanted.length) {
      const set = new Set(wanted);
      blogs = blogs.filter((b) =>
        (b.tags || []).some((t) => set.has(String(t).toLowerCase()))
      );
    }
    return blogs.slice(0, 12).map((b) => ({
      slug: b.slug,
      image: b.featuredImageUrl || "",
      title: b.title,
      description: b.excerpt || "",
    }));
  } catch {
    return [];
  }
}

// The Customize page renders entirely from GET /api/customize (hero, steps,
// gallery, banner, blog guides, FAQ). This handler was missing — only POST
// (form submission) existed — so the fetch 405'd and the page rendered blank.
// Content is the store's own copy (constant.js) paired with the real customize
// assets in /public. Structured so it can later be sourced from the CMS.
const STEP_IMAGES = [
  "/images/customize/customize-5.png",
  "/images/customize/cut-clarity.png",
  "/images/customize/custom-engravings.png",
  "/images/customize/proposal-ring.png",
];

// Per-category hero banners for /customize?category=<slug>. The landing page
// picks the entry whose category_name matches the ?category param (falling back
// to the category_name:null default), so the nav's Customize tiles land the
// shopper on a banner for THAT jewelry type with a Start button that opens the
// form pre-scoped (category_id + size drive the whole form flow).
const CATEGORY_IDS = { ring: 10, band: 1, bracelet: 3, necklace: 6, earring: 4 };

const heroButton = (text, slug) => [
  {
    button_text: text,
    button_url: slug
      ? `/customize/form/reference?category_id=${CATEGORY_IDS[slug]}&size=${slug}`
      : "/customize/form/reference",
    button_color: "#162640",
    button_border: "#162640",
    button_text_color: "#ffffff",
  },
];

const CATEGORY_HEROES = [
  {
    category_name: "ring",
    title: "Design Your Engagement Ring",
    subtitle:
      "A solitaire, halo, or something entirely your own — built around your stone, your story.",
    file: "/images/customize/proposal-ring.png",
    buttons: heroButton("Start Your Ring", "ring"),
  },
  {
    category_name: "band",
    title: "Design Your Wedding Band",
    subtitle:
      "Classic, pavé, or engraved — a band made to sit perfectly beside your ring, forever.",
    file: "/images/customize/twin-band-design.png",
    buttons: heroButton("Start Your Band", "band"),
  },
  {
    category_name: "bracelet",
    title: "Design Your Bracelet",
    subtitle:
      "Tennis lines, bangles, and charms — hand-set diamonds made to move with you.",
    file: "/images/home/Bracelets-collection.png",
    buttons: heroButton("Start Your Bracelet", "bracelet"),
  },
  {
    category_name: "necklace",
    title: "Design Your Necklace",
    subtitle:
      "Pendants and stations in responsibly sourced gold — worn close, made personal.",
    file: "/images/home/Necklaces-collection.png",
    buttons: heroButton("Start Your Necklace", "necklace"),
  },
  {
    category_name: "earring",
    title: "Design Your Earrings",
    subtitle:
      "Studs, hoops, and drops — matched pairs set by hand at the atelier.",
    file: "/images/home/Earrings-collection.png",
    buttons: heroButton("Start Your Earrings", "earring"),
  },
];

// Default content (used until the page is customised in the CMS).
function buildDefaultContent() {
  return {
    cms_page: {
      hero_section: [
        {
          category_name: null,
          title: "Design Something Uniquely Yours",
          subtitle:
            "From first sketch to the final piece — bespoke jewelry, crafted with you.",
          file: "/videos/customize-banner.mp4",
          buttons: heroButton("Start Your Design", null),
        },
        ...CATEGORY_HEROES,
      ],
      service_section: [
        {
          headtitle: "How Custom Design Works",
          description: "Four simple steps from your idea to a finished heirloom.",
          service_items: CRAFTING_YOUR_VISION.map((s, i) => ({
            id: i + 1,
            image: STEP_IMAGES[i % STEP_IMAGES.length],
            title: s.title,
            service_description: s.text,
          })),
        },
      ],
      custom_creation_head: [
        {
          title: "Custom Creations, Loved by Hearts",
          description: "A few of the bespoke pieces we've brought to life for our clients.",
        },
      ],
      custom_creation: [],
      banner_section: [
        {
          bg_file: "/videos/the-art-of-making.mp4",
          title: "Your Story, Handcrafted",
          description:
            "Every RJ House piece is made to order — ethically sourced, expertly crafted, and delivered worldwide.",
          buttons: [
            {
              button_text: "Book a Consultation",
              button_url: "/book-an-appointment",
              button_color: "#ffffff",
            },
          ],
        },
      ],
    },
    blog_category: {
      heading: "Design With Confidence",
      description: "Guides from our journal to help you choose with clarity.",
      // Category-driven: the guide cards are pulled from published Blog Posts in
      // these categories (tags). Empty = all recent posts. Pick categories in the
      // CMS (Customize Page → Design Guides). `blogs` is filled by the GET handler.
      categories: [],
    },
    faq_section: {
      headtitle: "Questions, Answered",
      description: "Everything you need to know about custom design at RJ House.",
      faqs: QUESTIONS.map((q) => ({ question: q.question, answer: q.ans })),
    },
  };
}

// Serve CMS-managed content when the "customize-page" section exists and is
// non-empty; otherwise fall back to the defaults above. So the page works
// immediately AND becomes fully editable from the CMS (pageSlug "customize").
// CORS is open so the CMS editor (different origin) can read the default content
// to seed its form; this endpoint only ever returns public page content.
export async function GET() {
  let data = buildDefaultContent();
  try {
    const res = await rjApi("GET", "/cms/sections?pageSlug=customize");
    const sections = res.raw?.data || res.raw || [];
    // Prefer the most-recently-updated section (defensive against duplicates).
    const matching = (Array.isArray(sections) ? sections : []).filter(
      (s) => s?.sectionKey === "customize-page"
    );
    matching.sort(
      (a, b) => new Date(b?.updatedAt || 0) - new Date(a?.updatedAt || 0)
    );
    const sec = matching[0];
    if (sec?.content?.cms_page) {
      data = sec.content;
      data.cms_page.custom_creation = verifiedCreations(data.cms_page.custom_creation);
      // Keep the per-category hero banners working even when the CMS section
      // was saved with a single (default) hero: CMS entries win per
      // category_name; defaults fill any category the CMS doesn't define.
      const cmsHeroes = Array.isArray(data.cms_page.hero_section)
        ? data.cms_page.hero_section
        : [];
      const covered = new Set(cmsHeroes.map((h) => h?.category_name ?? null));
      data.cms_page.hero_section = [
        ...cmsHeroes,
        ...CATEGORY_HEROES.filter((h) => !covered.has(h.category_name)),
      ];
    }
  } catch {
    /* CMS unavailable — use defaults */
  }

  // Always populate the Design Guides cards from live Blog Posts in the selected
  // categories (so the section reflects the current journal, not a stored copy).
  const bc = data.blog_category || {};
  data = {
    ...data,
    blog_category: { ...bc, blogs: await buildGuidesFromBlog(bc.categories) },
  };

  const out = NextResponse.json({ status: true, data });
  out.headers.set("Access-Control-Allow-Origin", "*");
  return out;
}

// Persist a custom-design request to the backend (the CMS forms inbox reads
// these from /storefront/custom-requests). Previously a no-op stub that
// silently discarded every submission.
export async function POST(req) {
  try {
    const b = await req.json().catch(() => ({}));

    const metalParts = [b.metal, b.metal_color].filter(Boolean).join(" ");
    const stoneParts = [b.shape, b.carat ? `${b.carat} ct` : ""].filter(Boolean).join(" · ");
    const descParts = [
      b.description || b.notes,
      b.clarity ? `Clarity: ${b.clarity}` : "",
      b.color || b.color_range ? `Color: ${b.color || b.color_range}` : "",
      b.ring_size ? `Ring size: ${b.ring_size}` : "",
      b.reference_url ? `Reference: ${b.reference_url}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      name: b.full_name || b.name || "",
      email: b.email || "",
      phone: b.phone || b.phone_number || "",
      jewelryType: b.category_name || b.jewelry_type || b.jewelryType || "Custom",
      metal: metalParts || null,
      stone: stoneParts || null,
      budget: b.budget || null,
      description: descParts || null,
      referenceImages: Array.isArray(b.file) ? b.file : b.file ? [b.file] : [],
      marketing: marketingFromRequest(req),
    };

    if (!payload.name || (!payload.email && !payload.phone)) {
      return NextResponse.json(
        { status: false, errors: { full_name: ["Name and email or phone are required"] } },
        { status: 422 }
      );
    }

    const result = await rjApi("POST", "/storefront/custom-requests", { body: payload });
    if (!result.ok) {
      return NextResponse.json(
        { status: false, message: result.raw?.message || "Submission failed" },
        { status: result.status || 500 }
      );
    }
    return NextResponse.json({
      status: true,
      message: "Customization request received! We'll contact you soon.",
      data: result.raw?.data || result.raw,
    });
  } catch (e) {
    console.error("customize submit error:", e);
    return NextResponse.json({ status: false, message: e.message }, { status: 500 });
  }
}
