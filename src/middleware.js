import { NextResponse } from "next/server";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "dashboard",
  "auth",
  "login",
  "signup",
  "manage",
  "posts",
  "lessons",
  "templates",
  "audience",
  "analytics",
  "showcase",
  "status",
  "whitepaper",
  "security",
  "changelog"
]);

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sites") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const previewSub = url.searchParams.get("preview_sub");
  if (previewSub) {
    const cleanPreview = previewSub.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleanPreview && !RESERVED_SUBDOMAINS.has(cleanPreview)) {
      const targetSlug = url.searchParams.get("preview_slug") || "";
      url.pathname = targetSlug
        ? `/sites/${cleanPreview}/${targetSlug}`
        : `/sites/${cleanPreview}`;
      return NextResponse.rewrite(url);
    }
  }

  const rawHost = request.headers.get("host") || "";
  const hostname = rawHost.split(":")[0].toLowerCase();
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "myfa.page").toLowerCase();

  let detectedSubdomain = null;

  if (hostname.endsWith(`.${rootDomain}`)) {
    const candidate = hostname.slice(0, hostname.length - rootDomain.length - 1);
    if (candidate && !candidate.includes(".") && !RESERVED_SUBDOMAINS.has(candidate)) {
      detectedSubdomain = candidate;
    }
  } else if (hostname.endsWith(".localhost")) {
    const candidate = hostname.slice(0, hostname.length - ".localhost".length);
    if (candidate && !candidate.includes(".") && !RESERVED_SUBDOMAINS.has(candidate)) {
      detectedSubdomain = candidate;
    }
  }

  if (detectedSubdomain) {
    url.pathname = `/sites/${detectedSubdomain}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
