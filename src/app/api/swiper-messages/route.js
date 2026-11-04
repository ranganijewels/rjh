import { NextResponse } from "next/server";
import { rjApi } from "@/lib/apiHandler";

// Announcement bar messages, edited in CMS Studio ▸ Announcement Bar
// (homepage / top-header). Shown when the section is missing or empty —
// keep these in line with the published shipping, returns and certification
// policies.
const DEFAULT_MESSAGES = [
  "Free insured shipping on every order",
  "Certified lab-grown diamonds | Hallmarked 10K, 14K & 18K gold and 925 silver",
  "14-day returns on eligible items | Lifetime manufacturing warranty",
];

// Older saves keep one pipe-separated `text`; newer ones a `messages` list.
const fromSection = (content = {}) => {
  if (Array.isArray(content.messages)) return content.messages.map((m) => String(m).trim()).filter(Boolean);
  if (typeof content.text === "string") return content.text.split("|").map((m) => m.trim()).filter(Boolean);
  return [];
};

export async function GET() {
  let messages = [];
  try {
    const result = await rjApi("GET", "/cms/sections?pageSlug=homepage");
    const sections = Array.isArray(result.raw?.data) ? result.raw.data : [];
    const section = sections.find((s) => s.sectionKey === "top-header" && s.isPublished !== false);
    messages = fromSection(section?.content);
  } catch {
    // Fall through to the defaults.
  }
  if (!messages.length) messages = DEFAULT_MESSAGES;
  return NextResponse.json({ data: messages.map((message, i) => ({ id: i + 1, message })) });
}
