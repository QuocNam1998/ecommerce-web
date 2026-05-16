function Hero({ onNavigate }) {
  return (
    <section className="market-hero">
      <div className="market-hero__inner">
        <div className="market-hero__banner">
          <p className="market-hero__eyebrow">Mega campaign</p>
          <h1>Mid-year deals with free shipping and daily flash prices.</h1>
          <p>Shop an orange-marketplace style storefront with stacked promos, fast checkout, and curated best sellers for your home setup.</p>
          <div className="market-hero__actions">
            <a className="button button--light" onClick={() => document.getElementById("catalog")?.scrollIntoView({behavior: "smooth"})}>Shop now</a>
            <a className="button button--ghost-light" onClick={() => onNavigate("checkout")}>View cart</a>
          </div>
        </div>
        <div className="market-hero__side-grid">
          <article className="market-side-card market-side-card--accent">
            <span>Voucher Pack</span>
            <strong>Save {formatCurrency(25)}</strong>
            <p>Collect bundle vouchers before checkout.</p>
          </article>
          <article className="market-side-card">
            <span>Free Shipping</span>
            <strong>Orders over {formatCurrency(150)}</strong>
            <p>Daily shipping credits on highlighted items.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <section className="category-strip">
      <div className="category-strip__inner">
        {CATEGORIES.map(cat => (
          <a key={cat} className="category-chip">{cat}</a>
        ))}
      </div>
    </section>
  );
}

function FeatureBand() {
  return (
    <section className="feature-band">
      <article><strong>Free shipping</strong><span>Voucher-friendly checkout for selected orders</span></article>
      <article><strong>100% authentic</strong><span>Curated brands and premium home essentials</span></article>
      <article><strong>Daily deals</strong><span>New markdowns and campaign bundles every day</span></article>
      <article><strong>Secure payment</strong><span>Ready for card, wallet, and COD integrations</span></article>
    </section>
  );
}

Object.assign(window, { Hero, CategoryStrip, FeatureBand });
