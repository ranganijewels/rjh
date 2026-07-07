import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";
export async function GET(req) {
  try {
    const result = await rjApi("GET", "/cms/faqs");
    const faqs = result.raw?.data || [];
    // FAQs.jsx groups by faq_category_title and renders the "FAQs Page" group's faqs[].
    return NextResponse.json({
      data: [
        {
          faq_category_title: "FAQs Page",
          faqs: faqs.map(f => ({ id: f.id, question: f.question, answer: f.answer, category: f.category })),
        },
      ],
    });
  } catch { return NextResponse.json({ data: [] }); }
}
