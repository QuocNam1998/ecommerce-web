type AuthPromoProps = {
  brandName: string;
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

export function AuthPromo({
  brandName,
  event,
  subtitle,
  headline,
  vipTitle,
  vipValue,
  vipNote,
  luckyTitle,
  luckyValue,
  luckyNote,
  shippingTitle,
  shippingValue,
  shippingNote,
  footerTitle,
  footerDate
}: AuthPromoProps) {
  return (
    <div className="login-promo" aria-hidden="true">
      <div className="auth-promo__backdrop auth-promo__backdrop--left" />
      <div className="auth-promo__backdrop auth-promo__backdrop--right" />
      <div className="auth-promo__spark auth-promo__spark--top" />
      <div className="auth-promo__spark auth-promo__spark--bottom" />

      <div className="auth-promo__frame">
        <div className="auth-promo__pill">{brandName}</div>
        <div className="login-promo__event">{event}</div>
        <div className="login-promo__subtitle">{subtitle}</div>
        <div className="login-promo__headline">{headline}</div>

        <div className="auth-promo__hero-card">
          <div className="auth-promo__hero-ribbon">{vipTitle}</div>
          <div className="auth-promo__hero-value">{vipValue}</div>
          <div className="auth-promo__hero-copy">{vipNote}</div>
        </div>

        <div className="login-promo__tickets">
          <div className="promo-ticket promo-ticket--left">
            <span>{luckyTitle}</span>
            <strong>{luckyValue}</strong>
            <small>{luckyNote}</small>
          </div>
          <div className="promo-ticket promo-ticket--center">
            <span>{shippingTitle}</span>
            <strong>{shippingValue}</strong>
            <small>{shippingNote}</small>
          </div>
          <div className="promo-ticket promo-ticket--right">
            <span>{brandName}</span>
            <strong>{footerTitle}</strong>
            <small>{footerDate}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
