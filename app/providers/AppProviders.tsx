"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import type { Locale, Messages } from "@/lib/i18n/messages";

type AppProvidersProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
};

export function AppProviders({
  children,
  locale,
  messages
}: AppProvidersProps) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <CartProvider>{children}</CartProvider>
    </I18nProvider>
  );
}
