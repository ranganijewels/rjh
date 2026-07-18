import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Maps a CmsSection row's admin-editor content shape into exactly what
// MenuOptionsPanel.js/MobileNav.jsx already expect from MENUS_OPTIONS
// entries — those two files are unchanged, this route does the translation.
const mapStandard = (section) => {
  const c = section.content || {};
  const columns = Array.isArray(c.columns) ? c.columns : [];
  const img = c.imageSection;
  return {
    title: section.label,
    categories: columns.map((col) => ({
      title: col.title,
      items: Array.isArray(col.items) ? col.items : [],
    })),
    imageSection:
      img && img.imageUrl
        ? [
            {
              imageUrl: img.imageUrl,
              additionalTitle: img.title,
              additionalDescription: img.description,
              callToAction: { text: img.ctaText, url: img.ctaUrl },
            },
          ]
        : undefined,
  };
};

const mapCustomize = (section) => {
  const c = section.content || {};
  return {
    title: section.label,
    categoriesWithMedia: true,
    mediaCategories: Array.isArray(c.mediaTiles) ? c.mediaTiles : [],
    categories: [],
  };
};

export async function GET() {
  try {
    const res = await rjApi("GET", "/cms/sections?pageSlug=mega-menu");
    const rows = res.raw?.data || [];
    const menus = {};
    rows.forEach((section) => {
      menus[section.sectionKey] = section.sectionType === "mega-menu-tiles" ? mapCustomize(section) : mapStandard(section);
    });
    return NextResponse.json({ data: menus });
  } catch {
    return NextResponse.json({ data: {} });
  }
}
