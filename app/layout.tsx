import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "@/app/providers/AppProviders";
import { RouteChrome } from "@/app/components/RouteChrome";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Modern Market",
  description: "A premium Next.js ecommerce storefront built from scratch."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <AppProviders locale={locale} messages={messages}>
          <RouteChrome />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
