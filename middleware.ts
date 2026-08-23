import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UserRole } from "@/types/user";
import { canAccessRoute } from "./configs/navigation";

/**
 * =====================================================
 * FUEL STATION MANAGEMENT SYSTEM
 * NEXT.JS FRONTEND MIDDLEWARE
 * =====================================================
 *
 * RESPONSIBILITIES
 * ===============
 *
 * 1. Check whether a frontend authentication session exists
 * 2. Read the frontend role
 * 3. Protect dashboard routes
 * 4. Redirect unauthorized users
 *
 * IMPORTANT
 * =========
 *
 * This middleware is NOT the final security boundary.
 *
 * The Express API MUST independently enforce:
 *
 * - Authentication
 * - RBAC
 * - Permissions
 * - Station ownership
 * - Resource ownership
 * - IDOR protection
 * - Business rules
 * - Approval rules
 *
 * NEVER trust:
 *
 * - role cookies
 * - frontend permissions
 * - hidden UI buttons
 * - middleware alone
 *
 * The backend remains authoritative.
 */

/**
 * =====================================================
 * 1. VALID FUEL STATION ROLES
 * =====================================================
 *
 * These MUST match the backend UserRole values.
 *
 * Backend:
 *
 * admin
 * station_manager
 * station_staff
 */

const VALID_ROLES: UserRole[] = [
  "admin",
  "station_manager",
  "station_staff",
];

/**
 * =====================================================
 * 2. PUBLIC FRONTEND ROUTES
 * =====================================================
 *
 * These routes do not require authentication.
 *
 * Keep this list intentionally small.
 */

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/unauthorized")
  );
}

/**
 * =====================================================
 * 3. REDIRECT HELPER
 * =====================================================
 */

function redirectTo(
  request: NextRequest,
  pathname: string,
): NextResponse {
  const url = request.nextUrl.clone();

  url.pathname = pathname;

  return NextResponse.redirect(url);
}

/**
 * =====================================================
 * 4. ACCESS TOKEN COOKIE
 * =====================================================
 *
 * Your backend stores the JWT in:
 *
 *     accessToken
 *
 * Example:
 *
 * Set-Cookie:
 * accessToken=eyJhbGciOiJIUzI1Ni...
 *
 * IMPORTANT:
 *
 * The middleware does NOT decode the JWT.
 *
 * It only checks whether the cookie exists.
 *
 * The Express backend remains responsible for:
 *
 * - JWT verification
 * - expiration
 * - signature validation
 * - user lookup
 * - role validation
 * - permission validation
 */

function hasSessionCookie(
  request: NextRequest,
): boolean {
  return Boolean(
    request.cookies.get("accessToken"),
  );
}

/**
 * =====================================================
 * 5. FRONTEND ROLE COOKIE
 * =====================================================
 *
 * Your backend also sets:
 *
 *     role=admin
 *
 * or:
 *
 *     role=station_manager
 *
 *     role=station_staff
 *
 *     role=driver
 *
 * The value is intentionally NOT encrypted.
 *
 * Example:
 *
 * Cookie:
 *
 * role=admin
 *
 * IMPORTANT SECURITY NOTE
 * =======================
 *
 * This cookie is only used for frontend routing/UI.
 *
 * It MUST NOT be used as the backend security boundary.
 *
 * A malicious user can potentially modify:
 *
 *     role=admin
 *
 * Therefore the backend MUST always derive authorization
 * from the verified access token/session and database.
 */

function getFrontendRole(
  request: NextRequest,
): UserRole | null {
  const roleValue =
    request.cookies.get("role")?.value;

  if (!roleValue) {
    return null;
  }

  /**
   * Validate the cookie value against the
   * application's supported roles.
   */

  if (
    !VALID_ROLES.includes(
      roleValue as UserRole,
    )
  ) {
    return null;
  }

  return roleValue as UserRole;
}

/**
 * =====================================================
 * 6. MIDDLEWARE
 * =====================================================
 */

export function middleware(
  request: NextRequest,
): NextResponse {
  const { pathname } = request.nextUrl;

  /**
   * ---------------------------------------------------
   * 1. PUBLIC ROUTES
   * ---------------------------------------------------
   *
   * Authentication is not required.
   */

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  /**
   * ---------------------------------------------------
   * 2. AUTHENTICATION CHECK
   * ---------------------------------------------------
   *
   * Check for the accessToken cookie.
   *
   * If it doesn't exist, redirect to login.
   *
   * IMPORTANT:
   *
   * This only determines whether the browser appears
   * to have a session.
   *
   * The Express API MUST independently verify the JWT.
   */

  if (!hasSessionCookie(request)) {
    return redirectTo(
      request,
      "/auth/login",
    );
  }

  /**
   * ---------------------------------------------------
   * 3. READ FRONTEND ROLE
   * ---------------------------------------------------
   */

  const role =
    getFrontendRole(request);

  /**
   * ---------------------------------------------------
   * 4. VALID ROLE REQUIRED
   * ---------------------------------------------------
   *
   * If the accessToken exists but the role cookie is
   * missing or invalid, deny frontend access.
   *
   * This prevents the middleware from guessing a role.
   */

  if (!role) {
    return redirectTo(
      request,
      "/unauthorized",
    );
  }

  /**
   * ---------------------------------------------------
   * 5. FRONTEND ROUTE AUTHORIZATION
   * ---------------------------------------------------
   *
   * canAccessRoute() uses:
   *
   * role
   *   ↓
   * ROLE_PERMISSIONS
   *   ↓
   * ROUTE_PERMISSIONS
   *
   * Example:
   *
   * driver
   *   ↓
   * /dashboard/vehicles
   *   ↓
   * vehicle.view
   *   ↓
   * true
   *
   *
   * Example:
   *
   * driver
   *   ↓
   * /dashboard/stations
   *   ↓
   * station.view
   *   ↓
   * false
   *   ↓
   * /unauthorized
   */

  if (
    !canAccessRoute(
      role,
      pathname,
    )
  ) {
    return redirectTo(
      request,
      "/unauthorized",
    );
  }

  /**
   * ---------------------------------------------------
   * 6. ALLOW REQUEST
   * ---------------------------------------------------
   */

  return NextResponse.next();
}

/**
 * =====================================================
 * MATCHER
 * =====================================================
 *
 * Middleware runs on frontend pages.
 *
 * Excluded:
 *
 * - API routes
 * - Sanctum
 * - AI API
 * - Next.js internals
 * - static files
 * - files with extensions
 * - auth API
 *
 * =====================================================
 */

export const config = {
  matcher: [
    "/((?!api|sanctum|ai/api|_next|.*\\..*|auth/api).*)",
  ],
};