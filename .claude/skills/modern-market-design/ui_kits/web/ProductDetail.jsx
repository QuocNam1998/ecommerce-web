function ProductDetail({ product, onAdd, onNavigate, onBack }) {
  if (!product) return null;
  return (
    <main className="page-shell">
      <div style={{marginBottom: "1rem"}}>
        <a onClick={onBack} style={{color: "var(--accent)", cursor: "pointer", fontSize: ".9rem"}}>← Back to shop</a>
      </div>
      <div className="product-detail product-detail--marketplace">
        <div className="product-detail__gallery-card">
          <div className="product-detail__image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail__gallery-notes">
            <span>Official store</span>
            <span>15-day returns</span>
            <span>Secure checkout</span>
          </div>
        </div>
        <div className="product-detail__content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-detail__stats-row">
            <span>4.9 ratings</span>
            <span>1.2k sold</span>
            <span>Brand voucher available</span>
          </div>
          <div className="product-detail__price-panel">
            <p className="product-detail__price">{formatCurrency(product.price)}</p>
            <span>Free shipping with marketplace voucher</span>
          </div>
          <p className="product-detail__description">{product.description}</p>

          <div className="tag-row">
            {product.highlights.map(h => <span key={h} className="tag">{h}</span>)}
          </div>

          <div className="info-card">
            <h2>What's included</h2>
            <ul>
              {product.includes.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>

          <div className="product-detail__actions">
            <button type="button" className="button button--primary" onClick={() => onAdd(product)}>Add to cart</button>
            <a className="button button--ghost" onClick={() => { onAdd(product); onNavigate("checkout"); }}>Buy now</a>
          </div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { ProductDetail });
