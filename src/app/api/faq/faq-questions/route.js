import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Until the CMS setting is saved, product pages show these FAQ categories.
const DEFAULT_PDP_CATEGORIES = ["BUYING & PRODUCT QUESTIONS", "SIZING & AFTERCARE"];

async function pdpCategories() {
  try {
    const res = await rjApi("GET", "/cms/sections?pageSlug=faqs");
    const list = res.raw?.data || res.raw || [];
    const sec = (Array.isArray(list) ? list : []).find(
      (s) => s.sectionKey === "faq-settings" && s.isPublished !== false
    );
    const cats = sec?.content?.pdp_categories;
    return Array.isArray(cats) ? cats : DEFAULT_PDP_CATEGORIES;
  } catch {
    return DEFAULT_PDP_CATEGORIES;
  }
}

// One group per FAQ category, in the order the CMS sort order introduces them.
// Each group is flagged `pdp` when the admin chose it for product pages.
export async function GET() {
  try {
    const [result, pdp] = await Promise.all([rjApi("GET", "/cms/faqs"), pdpCategories()]);
    const faqs = result.raw?.data || [];
    const pdpSet = new Set(pdp.map((c) => String(c).trim().toLowerCase()));
    const groups = new Map();
    for (const f of faqs) {
      const title = String(f.category || "").trim() || "General";
      if (!groups.has(title)) {
        groups.set(title, { faq_category_title: title, pdp: pdpSet.has(title.toLowerCase()), faqs: [] });
      }
      groups.get(title).faqs.push({ id: f.id, question: f.question, answer: f.answer, category: title });
    }
    return NextResponse.json({ data: [...groups.values()] });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
