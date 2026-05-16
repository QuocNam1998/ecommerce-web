function AuthTopbar({ pageName, onNavigate }) {
  return (
    <div className="login-topbar">
      <div className="login-topbar__inner">
        <div className="login-brand" onClick={() => onNavigate("home")}>
          <span className="login-brand__mark">M</span>
          <span className="login-brand__name">Modern Market</span>
          <span className="login-brand__divider">|</span>
          <span style={{fontSize: ".95rem", color: "#222"}}>{pageName}</span>
        </div>
        <span className="login-topbar__help">Need help?</span>
      </div>
    </div>
  );
}

function AuthPromo() {
  return (
    <div className="login-promo" aria-hidden="true">
      <div className="auth-promo__backdrop auth-promo__backdrop--left" />
      <div className="auth-promo__backdrop auth-promo__backdrop--right" />
      <div className="auth-promo__spark auth-promo__spark--top" />
      <div className="auth-promo__spark auth-promo__spark--bottom" />

      <div className="auth-promo__frame">
        <div className="auth-promo__pill">Modern Market</div>
        <div className="login-promo__event">4.4</div>
        <div className="login-promo__subtitle">MEGA SALE</div>
        <div className="login-promo__headline">VOUCHERS</div>

        <div className="auth-promo__hero-card">
          <div className="auth-promo__hero-ribbon">Member</div>
          <div className="auth-promo__hero-value">25%</div>
          <div className="auth-promo__hero-copy">new vouchers every day</div>
        </div>

        <div className="login-promo__tickets">
          <div className="promo-ticket">
            <span>1,000</span>
            <strong>winning</strong>
            <small>receive gold rewards</small>
          </div>
          <div className="promo-ticket promo-ticket--center">
            <span>FREESHIP</span>
            <strong>$0</strong>
            <small>delivery deals</small>
          </div>
          <div className="promo-ticket">
            <span>Modern Market</span>
            <strong>FAST | EASY</strong>
            <small>Mar 26 – Apr 6</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function Login({ onNavigate }) {
  const [identifier, setIdentifier] = React.useState("shopper@modern-market.dev");
  const [password, setPassword] = React.useState("Shopper@123");
  const [submitting, setSubmitting] = React.useState(false);

  const isEmail = /\S+@\S+\.\S+/.test(identifier);
  const isPhone = /^[0-9+\-\s()]{7,}$/.test(identifier);
  const idErr = identifier.trim().length === 0
    ? "Please enter your phone number or email."
    : (!isEmail && !isPhone) ? "Enter a valid phone number or email address." : "";
  const pwErr = password.trim().length === 0
    ? "Please enter your password."
    : password.length < 6 ? "Password must be at least 6 characters." : "";
  const hasErr = Boolean(idErr || pwErr);

  function handleSubmit(e) {
    e.preventDefault();
    if (hasErr) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onNavigate("home"); }, 600);
  }

  return (
    <div className="login-page">
      <AuthTopbar pageName="Login" onNavigate={onNavigate} />
      <div className="login-stage">
        <div className="login-stage__inner">
          <AuthPromo />
          <div className="login-card">
            <div className="login-card__header">
              <span className="login-card__title">Login</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <input
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Phone number / Email"
                />
                <span className={`login-field__hint ${idErr ? "login-field__hint--error" : ""}`}>
                  {idErr || "Use your phone number or email address."}
                </span>
              </label>
              <label className="login-field">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <span className={`login-field__hint ${pwErr ? "login-field__hint--error" : ""}`}>
                  {pwErr || "Password must be at least 6 characters."}
                </span>
              </label>

              <button type="submit" className="button button--primary button--full login-submit" disabled={submitting || hasErr}>
                {submitting ? "PROCESSING..." : "LOG IN"}
              </button>

              <div className="login-form__meta">
                <a>Forgot password</a>
                <span />
              </div>
            </form>

            <div className="login-divider"><span>OR</span></div>

            <div className="login-socials">
              <button className="login-social-button" disabled type="button">
                <span className="login-social-button__icon login-social-button__icon--facebook">f</span>
                Facebook
              </button>
              <button className="login-social-button" disabled type="button">
                <span className="login-social-button__icon login-social-button__icon--google">G</span>
                Google
              </button>
            </div>

            <p className="login-agreement">
              By logging in, you agree to Modern Market's <a>Terms of Service</a> & <a>Privacy Policy</a>.
            </p>

            <p className="login-register">
              New to Modern Market? <a onClick={() => onNavigate("register")}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Register({ onNavigate }) {
  const [form, setForm] = React.useState({
    displayName: "Modern Market Shopper",
    email: "new-shopper@modern-market.dev",
    phone: "0327130999",
    password: "Shopper@123",
    confirmPassword: "Shopper@123",
  });
  const [submitting, setSubmitting] = React.useState(false);

  function set(k, v) { setForm(f => ({...f, [k]: v})); }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onNavigate("home"); }, 600);
  }

  return (
    <div className="login-page">
      <AuthTopbar pageName="Register" onNavigate={onNavigate} />
      <div className="login-stage">
        <div className="login-stage__inner">
          <AuthPromo />
          <div className="login-card">
            <div className="login-card__header">
              <span className="login-card__title">Sign Up</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field">
                <input value={form.displayName} onChange={e => set("displayName", e.target.value)} placeholder="Full name" />
                <span className="login-field__hint">This name will appear on your account.</span>
              </label>
              <label className="login-field">
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Email" />
                <span className="login-field__hint">We will use this email for sign-in and updates.</span>
              </label>
              <label className="login-field">
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="Phone number" />
                <span className="login-field__hint">Optional, but useful for delivery updates.</span>
              </label>
              <label className="login-field">
                <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Password" />
                <span className="login-field__hint">Strong password.</span>
              </label>
              <label className="login-field">
                <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Confirm password" />
                <span className="login-field__hint">Re-enter the same password to confirm.</span>
              </label>

              <button type="submit" className="button button--primary button--full login-submit" disabled={submitting}>
                {submitting ? "CREATING ACCOUNT..." : "SIGN UP"}
              </button>
            </form>

            <p className="login-register">
              Already have an account? <a onClick={() => onNavigate("login")}>Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Login, Register });
