import Link from "next/link";
import { AuthPageShell, RegisterForm } from "@/features/auth";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RegisterPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const tCommon = createTranslator(messages, "common");
  const tLogin = createTranslator(messages, "login");
  const t = createTranslator(messages, "register");

  return (
    <AuthPageShell
      brandName={tCommon("brandName")}
      helpText={t("help")}
      pageName={t("pageName")}
      promo={{
        event: tLogin("promoEvent"),
        subtitle: tLogin("promoSubtitle"),
        headline: tLogin("promoHeadline"),
        vipTitle: tLogin("promoTicketVipTitle"),
        vipValue: tLogin("promoTicketVipValue"),
        vipNote: tLogin("promoTicketVipNote"),
        luckyTitle: tLogin("promoTicketLuckyTitle"),
        luckyValue: tLogin("promoTicketLuckyValue"),
        luckyNote: tLogin("promoTicketLuckyNote"),
        shippingTitle: tLogin("promoTicketShippingTitle"),
        shippingValue: tLogin("promoTicketShippingValue"),
        shippingNote: tLogin("promoTicketShippingNote"),
        footerTitle: tLogin("promoFooterTitle"),
        footerDate: tLogin("promoFooterDate")
      }}
    >
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__title">{t("cardTitle")}</span>
        </div>

        <RegisterForm />

        <p className="login-agreement">
          {t("agreementPrefix")} <a href="#">{t("termsOfService")}</a> &{" "}
          <a href="#">{t("privacyPolicy")}</a>{" "}
          {t("agreementSuffix")}
        </p>

        <p className="login-register">
          {t("loginPrompt")} <Link href="/login">{t("login")}</Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
