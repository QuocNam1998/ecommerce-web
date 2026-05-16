"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/app/layout/SiteHeader";

const AUTH_ROUTES = new Set(["/login", "/register"]);

export function HeaderChrome() {
  const pathname = usePathname();

  if (AUTH_ROUTES.has(pathname)) {
    return null;
  }

  return <SiteHeader />;
}
