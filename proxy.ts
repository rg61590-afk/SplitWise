import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Auth routes (redirect to dashboard if logged in)
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  // API routes should not be protected by middleware
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // Redirect to login if accessing protected route without auth
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and accessing auth routes
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|apple-icon).*)"],
};
