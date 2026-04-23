// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth");
  const url = req.nextUrl.clone();

  // If user is trying to access login page
  if (url.pathname === "/") {
    if (token) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // If no token, let them access login
    return NextResponse.next();
  }

  // For protected routes: redirect if no token
  if ((url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin")) && !token) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to login page and protected routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"],
};
