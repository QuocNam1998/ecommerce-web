import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  dictionaries,
  type Locale
} from "@/lib/i18n/messages";

function isLocale(value: string | null | undefined): value is Locale {
  if (!value) {
    return false;
  }

  return value in dictionaries;
}

export function resolveLocale(input: string | null | undefined): Locale {
  if (!input) {
    return DEFAULT_LOCALE;
  }

  const candidates = input
    .split(",")
    .flatMap((part) => part.trim().split("-"))
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (isLocale(candidate)) {
      return candidate;
    }
  }

  return DEFAULT_LOCALE;
}

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return resolveLocale(headerStore.get("accept-language"));
}

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}
