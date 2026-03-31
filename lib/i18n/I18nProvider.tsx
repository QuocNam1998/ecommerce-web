"use client";

import {
  createContext,
  useContext,
  type ReactNode
} from "react";
import type { Locale, Messages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
};

export function I18nProvider({
  children,
  locale,
  messages
}: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useLocale must be used within I18nProvider.");
  }

  return context.locale;
}

export function useTranslations(namespace?: keyof Messages) {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider.");
  }

  return createTranslator(context.messages, namespace);
}
