import Link from "next/link";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { AuthPageShell, LoginForm } from "@/features/auth";

export default async function LoginPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const tCommon = createTranslator(messages, "common");
  const t = createTranslator(messages, "login");

  return (
    <AuthPageShell
      brandName={tCommon("brandName")}
      helpText={t("help")}
      pageName={t("pageName")}
      promo={{
        event: t("promoEvent"),
        subtitle: t("promoSubtitle"),
        headline: t("promoHeadline"),
        vipTitle: t("promoTicketVipTitle"),
        vipValue: t("promoTicketVipValue"),
        vipNote: t("promoTicketVipNote"),
        luckyTitle: t("promoTicketLuckyTitle"),
        luckyValue: t("promoTicketLuckyValue"),
        luckyNote: t("promoTicketLuckyNote"),
        shippingTitle: t("promoTicketShippingTitle"),
        shippingValue: t("promoTicketShippingValue"),
        shippingNote: t("promoTicketShippingNote"),
        footerTitle: t("promoFooterTitle"),
        footerDate: t("promoFooterDate")
      }}
    >
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__title">{t("cardTitle")}</span>
        </div>

        <LoginForm />

        <div className="login-divider">
          <span>{t("divider")}</span>
        </div>

        <div className="login-socials">
          <button className="login-social-button" disabled type="button">
            <span className="login-social-button__icon login-social-button__icon--facebook">
              f
            </span>
            {t("facebook")}
          </button>
          <button className="login-social-button" disabled type="button">
            <span className="login-social-button__icon login-social-button__icon--google">
              G
            </span>
            {t("google")}
          </button>
        </div>

        <p className="login-agreement">
          {t("agreementPrefix")} <a href="#">{t("termsOfService")}</a> &{" "}
          <a href="#">{t("privacyPolicy")}</a>{" "}
          {t("agreementSuffix")}
        </p>

        <p className="login-register">
          {t("registerPrompt")} <Link href="/register">{t("register")}</Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
