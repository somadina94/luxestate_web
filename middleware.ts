import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import authService from "@/services/auth/auth-service";
import { useAppDispatch, setUser } from "./store";

const LOGIN_PATH = "/login";
const DEFAULT_AUTHENTICATED_REDIRECT = "/";

const AUTH_ROUTES = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-login",
] as const;

const DASHBOARD_ROUTES = [
  "/admin-dashboard",
  "/seller-dashboard",
  "/buyer-dashboard",
] as const;

const ROLE_TO_DASHBOARD: Record<string, string> = {
  admin: "/admin-dashboard",
  seller: "/seller-dashboard",
  buyer: "/buyer-dashboard",
};

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isDashboardRoute(pathname: string) {
  return DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth pages: if already logged in, redirect to dashboard (or home)
  if (isAuthRoute(pathname)) {
    const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!accessToken) {
      return NextResponse.next();
    }
    return authService.getUser(accessToken).then(({ status, data }) => {
      if (status === 200 && data) {
        const userRole = (data.role ?? "").toLowerCase();
        const dashboard =
          ROLE_TO_DASHBOARD[userRole] ?? DEFAULT_AUTHENTICATED_REDIRECT;
        return NextResponse.redirect(new URL(dashboard, request.url));
      }
      return NextResponse.next();
    });
  }

  // Dashboard pages: require auth and role match
  if (!isDashboardRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!accessToken) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return authService.getUser(accessToken).then(({ status, data }) => {
    if (status !== 200 || !data) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = (data.role ?? "").toLowerCase();
    const allowedDashboard = ROLE_TO_DASHBOARD[userRole];
    const requestedDashboard =
      DASHBOARD_ROUTES.find(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      ) ?? null;

    if (allowedDashboard && requestedDashboard !== allowedDashboard) {
      return NextResponse.redirect(new URL(allowedDashboard, request.url));
    }

    if (!allowedDashboard && requestedDashboard) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  });
}

export const config = {
  matcher: [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify-login",
    "/admin-dashboard/:path*",
    "/seller-dashboard/:path*",
    "/buyer-dashboard/:path*",
  ],
};
