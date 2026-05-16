function Icon({ name, className = "", style }) {
  return <i data-lucide={name} className={className} style={style} />;
}

function Header({ cartCount, onNavigate }) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return (
    <header className="site-header">
      <div className="site-header__promo">
        <div className="site-header__promo-inner">
          <div className="site-header__utility-links">
            <a>Seller Centre</a>
            <span className="sep">|</span>
            <a>Become a Seller</a>
            <span className="sep">|</span>
            <a>Download App</a>
            <span className="sep">|</span>
            <span style={{display: "inline-flex", alignItems: "center", gap: 6}}>
              Follow us
              <span className="socials">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </span>
            </span>
          </div>
          <div className="site-header__utility-links">
            <a className="iconlink"><Icon name="bell" />Notifications</a>
            <a className="iconlink"><Icon name="circle-help" />Help</a>
            <a className="iconlink"><Icon name="globe" />English <Icon name="chevron-down" /></a>
            <span className="sep">|</span>
            <a onClick={() => onNavigate("register")} style={{cursor: "pointer"}}>Sign Up</a>
            <span className="sep">|</span>
            <a onClick={() => onNavigate("login")} style={{cursor: "pointer"}}>Sign In</a>
          </div>
        </div>
      </div>

      <div className="site-header__main">
        <div className="site-header__inner">
          <div className="brand" onClick={() => onNavigate("home")}>
            <span className="brand-mark"><Icon name="shopping-bag" /></span>
            <span className="brand-name">Modern Market</span>
          </div>

          <div className="site-search">
            <div className="site-search__bar">
              <input
                aria-label="Search products"
                defaultValue=""
                placeholder="Modern Market — free shipping on orders over $150. Sign up now!"
              />
              <button type="button" className="site-search__button" aria-label="Search">
                <Icon name="search" />
              </button>
            </div>
            <div className="site-search__tags">
              {QUICK_LINKS.map(link => <a key={link}>{link}</a>)}
            </div>
          </div>

          <div className="site-header__actions">
            <button
              type="button"
              className="cart-icon"
              onClick={() => onNavigate("checkout")}
              aria-label={`Cart (${cartCount})`}
            >
              <Icon name="shopping-cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { Header, Icon });
