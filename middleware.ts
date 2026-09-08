import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

type Role = "CUSTOMER" | "WORKER" | "SOCIETY_ADMIN" | "FEDERATION_ADMIN" | "SUPER_ADMIN";

const GUARDED_SEGMENTS = ["customer", "worker", "society", "federation"] as const;

const ALLOWED_ROLES: Record<(typeof GUARDED_SEGMENTS)[number], Role[]> = {
  customer: ["CUSTOMER"],
  worker: ["WORKER"],
  society: ["SOCIETY_ADMIN", "FEDERATION_ADMIN"],
  federation: ["FEDERATION_ADMIN", "SUPER_ADMIN"],
};

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const { session, response } = await updateSession(request, intlResponse);

  const segments = request.nextUrl.pathname.split("/");
  const routeGroupSegment = segments[2] as (typeof GUARDED_SEGMENTS)[number] | undefined;

  if (!routeGroupSegment || !GUARDED_SEGMENTS.includes(routeGroupSegment)) {
    return response;
  }

  const locale = segments[1];

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  const role = session.user.app_metadata.role as Role | undefined;

  if (!role || !ALLOWED_ROLES[routeGroupSegment].includes(role)) {
    return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
