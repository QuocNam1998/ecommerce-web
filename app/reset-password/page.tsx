import Link from "next/link";
import { AuthPageShell, ResetPasswordForm } from "@/features/auth";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const tCommon = createTranslator(messages, "common");
  const tLogin = createTranslator(messages, "login");
  const t = createTranslator(messages, "resetPassword");

  const { token } = await searchParams;

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

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <>
            <p className="login-error">{t("invalidToken")}</p>
            <p className="login-register">
              <Link href="/forgot-password">{t("backToLogin")}</Link>
            </p>
          </>
        )}
      </div>
    </AuthPageShell>
  );
}
