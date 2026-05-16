import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers/AppProviders";
import { HeaderChrome } from "@/app/layout/HeaderChrome";
import type { Locale, Messages } from "@/lib/i18n/messages";

type MainLayoutProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
};

export function MainLayout({
  children,
  locale,
  messages
}: MainLayoutProps) {
  return (
    <AppProviders locale={locale} messages={messages}>
      <HeaderChrome />
      {children}
    </AppProviders>
  );
}
