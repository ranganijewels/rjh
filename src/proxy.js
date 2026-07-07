import { NextResponse } from "next/server";

export default function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const response = NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/account/:path*", "/wishlist/:path*"],
};
