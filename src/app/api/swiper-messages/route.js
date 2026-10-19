import { NextResponse } from "next/server";

// Announcement bar messages — keep claims in line with the published
// shipping, returns and certification policies.
export async function GET() {
  return NextResponse.json({
    data: [
      { id: 1, message: "Free insured shipping on every order" },
      { id: 2, message: "Certified lab-grown diamonds | Hallmarked 10K, 14K & 18K gold and 925 silver" },
      { id: 3, message: "14-day returns on eligible items | Lifetime manufacturing warranty" },
    ],
  });
}
