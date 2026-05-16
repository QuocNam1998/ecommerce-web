import Link from "next/link";
import type { ReactNode } from "react";
import { AuthPromo } from "./AuthPromo";

type AuthPageShellProps = {
  brandName: string;
  pageName: string;
  helpText: string;
  promo: {
    event: string;
    subtitle: string;
    headline: string;
    vipTitle: string;
    vipValue: string;
    vipNote: string;
    luckyTitle: string;
    luckyValue: string;
    luckyNote: string;
    shippingTitle: string;
    shippingValue: string;
    shippingNote: string;
    footerTitle: string;
    footerDate: string;
  };
  children: ReactNode;
};

export function AuthPageShell({
  brandName,
  pageName,
  helpText,
  promo,
  children
}: AuthPageShellProps) {
  return (
    <main className="login-page">
      <header className="login-topbar">
        <div className="login-topbar__inner">
          <Link className="login-brand" href="/">
            <span className="login-brand__mark">S</span>
            <span className="login-brand__name">{brandName}</span>
            <span className="login-brand__divider">{pageName}</span>
          </Link>
          <a className="login-topbar__help" href="#">
            {helpText}
          </a>
        </div>
      </header>

      <section className="login-stage">
        <div className="login-stage__inner">
          <AuthPromo brandName={brandName} {...promo} />
          {children}
        </div>
      </section>
    </main>
  );
}
