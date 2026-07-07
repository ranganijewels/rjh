import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function GET() {
  try {
    const result = await rjApi("GET", "/cms/navigation");
    const nav = result.raw?.data || [];
    const mapItem = (item) => ({
      id: item.id, title: item.title, link: item.url || item.link || "#",
      children: (item.children || []).map(mapItem),
    });
    return NextResponse.json({ data: nav.map(mapItem) });
  } catch {
    return NextResponse.json({
      data: [
        { id: 1, title: "Jewelry", link: "/product", children: [
          { id: 11, title: "Rings", link: "/product?category=rings", children: [] },
          { id: 12, title: "Necklaces", link: "/product?category=necklaces", children: [] },
          { id: 13, title: "Earrings", link: "/product?category=earrings", children: [] },
        ]},
        { id: 2, title: "Diamonds", link: "/product?category=diamonds", children: [] },
        { id: 3, title: "Customize", link: "/customize", children: [] },
        { id: 4, title: "Blog", link: "/blog", children: [] },
        { id: 5, title: "About Us", link: "/about-us", children: [] },
      ]
    });
  }
}
