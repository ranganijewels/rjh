import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { listingLinkCounts, linkIsEmpty } from "@/lib/menuLinks";

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
      link: col.link || undefined,
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
    // Drop menu links that would open an empty product listing, and columns
    // left with nothing in them.
    const links = rows.flatMap((sec) =>
      (sec.content?.columns || []).flatMap((col) => [col.link, ...(col.items || []).map((i) => i?.link)])
    );
    const counts = await listingLinkCounts(links);
    rows.forEach((sec) => {
      if (!Array.isArray(sec.content?.columns)) return;
      sec.content.columns = sec.content.columns
        .map((col) => ({
          ...col,
          link: linkIsEmpty(counts, col.link) ? undefined : col.link,
          items: (col.items || []).filter((i) => !linkIsEmpty(counts, i?.link)),
        }))
        .filter((col) => col.items.length || col.link);
    });
    const menus = {};
    rows.forEach((section) => {
      menus[section.sectionKey] = section.sectionType === "mega-menu-tiles" ? mapCustomize(section) : mapStandard(section);
    });
    return NextResponse.json({ data: menus });
  } catch {
    return NextResponse.json({ data: {} });
  }
}
