"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";

export function RouteChrome() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return <SiteHeader />;
}
