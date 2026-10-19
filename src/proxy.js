import { NextResponse } from "next/server";

// Exposes the request path to server components so the root layout can emit a
// self-referencing canonical for pages that don't declare their own.
export function proxy(request) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!api/|_next/|uploads/|.*\\.(?:svg|png|jpe?g|webp|gif|ico|mp4|webm|mov|css|js|txt|xml|woff2?)$).*)",
  ],
};
