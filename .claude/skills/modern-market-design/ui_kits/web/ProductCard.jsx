function ProductCard({ product, onOpen, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-card__image" onClick={() => onOpen(product)}>
        <img src={product.image} alt={product.name} />
        <span className="product-card__badge">{product.isNew ? "New" : "Mall"}</span>
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 onClick={() => onOpen(product)} style={{cursor: "pointer"}}>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__pricing">
          <strong>{formatCurrency(product.price)}</strong>
          <span>Free shipping</span>
        </div>
        <div className="product-card__meta-row">
          <span>4.9 rating</span>
          <span>Sold 1.2k+</span>
        </div>
        <div className="product-card__actions">
          <a onClick={() => onOpen(product)} style={{cursor: "pointer"}}>View details</a>
          <button
            type="button"
            className="button button--primary"
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            style={{minHeight: "2.25rem", padding: ".4rem .8rem", fontSize: "13px"}}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ title, eyebrow, ctaLabel, ctaTarget, products, onOpen, onAdd, onNavigate, alt }) {
  return (
    <section className={`section section--market ${alt ? "section--market-alt" : ""}`} id="catalog">
      <div className="section__heading section__heading--market">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {ctaLabel && <a onClick={() => onNavigate(ctaTarget)}>{ctaLabel}</a>}
      </div>
      <div className="product-grid product-grid--market">
        {products.map(p => (
          <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ProductCard, ProductGrid });
