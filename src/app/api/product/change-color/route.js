import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_id, color } = body;
    if (!product_id) return NextResponse.json({ product_image: "", rollover_image: "" });

    const result = await rjApi("GET", `/products/${product_id}`);
    const p = result.raw?.data || result.raw;
    if (!p) return NextResponse.json({ product_image: "", rollover_image: "" });

    const targetColor = (color || "YELLOW").toUpperCase();
    const isVideo = (url) => /\.(mp4|webm|mov|avi)$/i.test(url || "");

    const sortedMedia = (p.media || []).sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));

    // Find images for the selected color; fall back to YELLOW; fall back to any
    let colorImages = sortedMedia.filter(
      (m) => (m.metalColor || "YELLOW").toUpperCase() === targetColor && !isVideo(m.fileUrl || m.url)
    );
    if (colorImages.length === 0) {
      colorImages = sortedMedia.filter(
        (m) => (m.metalColor || "YELLOW").toUpperCase() === "YELLOW" && !isVideo(m.fileUrl || m.url)
      );
    }
    if (colorImages.length === 0) {
      colorImages = sortedMedia.filter((m) => !isVideo(m.fileUrl || m.url));
    }

    const primaryImage = colorImages[0]?.fileUrl || colorImages[0]?.url || "";
    const hoverImage = colorImages[1]?.fileUrl || colorImages[1]?.url || primaryImage;

    return NextResponse.json({ product_image: primaryImage, rollover_image: hoverImage });
  } catch (e) {
    console.error("change-color error:", e);
    return NextResponse.json({ product_image: "", rollover_image: "" });
  }
}
