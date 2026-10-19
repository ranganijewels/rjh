import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
import { listingLinkCounts, linkIsEmpty } from "@/lib/menuLinks";

export async function GET() {
  try {
    const result = await rjApi("GET", "/cms/navigation");
    const nav = result.raw?.data || [];
    const mapItem = (item) => ({
      id: item.id, title: item.label, link: item.url || item.link || "#",
      target: item.target || "_self",
      hasMegaMenu: !!item.metadata?.hasMegaMenu,
      megaMenuKey: item.metadata?.megaMenuKey,
      children: (item.children || []).map(mapItem),
    });
    const flat = (items) => items.flatMap((i) => [i.url || i.link, ...flat(i.children || [])]);
    const counts = await listingLinkCounts(flat(nav));
    const keep = (items) =>
      items
        .filter((i) => !linkIsEmpty(counts, i.url || i.link))
        .map((i) => ({ ...i, children: keep(i.children || []) }));
    return NextResponse.json({ data: keep(nav).map(mapItem) });
  } catch {
    // Genuine fetch failure — return empty so Navbar.js's own fallback to
    // the hardcoded NAV_MENUS/MENUS_OPTIONS takes over uniformly, instead
    // of layering in a second, different set of placeholder links here.
    return NextResponse.json({ data: [] });
  }
}
