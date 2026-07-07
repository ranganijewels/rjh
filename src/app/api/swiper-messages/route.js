import { NextResponse } from "next/server";
import { BUSINESS } from "@/config/business";

// Announcement bar messages. Currency shows in the visitor's currency at
// checkout; the store default is USD, so use $ here (was ₹, which mismatched).
export async function GET() {
  return NextResponse.json({
    data: [
      { id: 1, message: `Free insured shipping worldwide | Call us: ${BUSINESS.phone}` },
      { id: 2, message: "Certified diamonds | IGI & GIA certified | BIS Hallmarked Gold" },
      { id: 3, message: "Lifetime warranty & 30-day easy returns on every order" },
    ],
  });
}
