function Checkout({ items, onUpdateQty, onRemove, onNavigate }) {
  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const shipping = subtotal > 150 || items.length === 0 ? 0 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <main className="page-shell">
      <div className="checkout-layout checkout-layout--marketplace">
        <section className="checkout-card">
          <div className="section__heading section__heading--market">
            <div>
              <p className="eyebrow">Checkout</p>
              <h1 style={{fontSize: "1.6rem"}}>Review your order</h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <h2>Your cart is empty.</h2>
              <p>Browse the marketplace and add a few deals to continue.</p>
              <a className="button button--primary" onClick={() => onNavigate("home")}>Return to shop</a>
            </div>
          ) : (
            <div className="cart-list">
              {items.map(item => (
                <article key={item.product.id} className="cart-item">
                  <div>
                    <p className="cart-item__category">{item.product.category}</p>
                    <h2 style={{fontSize: "1rem", margin: "0 0 .25rem"}}>{item.product.name}</h2>
                    <p style={{margin: 0, fontSize: ".9rem"}}>{formatCurrency(item.product.price)}</p>
                  </div>
                  <div className="cart-item__controls">
                    <label>
                      Qty
                      <select value={item.quantity} onChange={(e) => onUpdateQty(item.product.id, Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </label>
                    <button type="button" className="button button--ghost" onClick={() => onRemove(item.product.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="summary-card">
          <p className="eyebrow">Order summary</p>
          <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong></div>
          <div className="summary-row"><span>Estimated tax</span><strong>{formatCurrency(tax)}</strong></div>
          <div className="summary-row summary-row--total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <button type="button" className="button button--primary button--full" disabled={items.length === 0}>Place order</button>
          <p className="summary-note">Demo checkout only. Connect payment and shipping providers when you are ready.</p>
        </aside>
      </div>
    </main>
  );
}

Object.assign(window, { Checkout });
