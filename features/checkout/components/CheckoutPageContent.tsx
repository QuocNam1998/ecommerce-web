"use client";

import Link from "next/link";
import { useCart } from "../../cart";
import { CHECKOUT_QUANTITY_OPTIONS } from "../constants/checkoutOptions";
import { formatCurrency } from "@/shared/utils/formatCurrency";

export function CheckoutPageContent() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total
  } = useCart();

  return (
    <main className="page-shell page-shell--marketplace">
      <div className="checkout-layout checkout-layout--marketplace">
        <section className="checkout-card checkout-card--marketplace">
          <div className="section__heading section__heading--market">
            <div>
              <p className="eyebrow">Checkout</p>
              <h1>Review your order</h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state empty-state--marketplace">
              <h2>Your cart is empty.</h2>
              <p>Browse the marketplace and add a few deals to continue.</p>
              <Link className="button button--primary" href="/">
                Return to shop
              </Link>
            </div>
          ) : (
            <div className="cart-list">
              {items.map((cartItem) => (
                <article key={cartItem.product.id} className="cart-item cart-item--marketplace">
                  <div>
                    <p className="cart-item__category">{cartItem.product.category}</p>
                    <h2>{cartItem.product.name}</h2>
                    <p>{formatCurrency(cartItem.product.price)}</p>
                  </div>
                  <div className="cart-item__controls">
                    <label>
                      Qty
                      <select
                        value={cartItem.quantity}
                        onChange={(changeEvent) =>
                          updateQuantity(
                            cartItem.product.id,
                            Number(changeEvent.target.value)
                          )
                        }
                      >
                        {CHECKOUT_QUANTITY_OPTIONS.map((quantityOption) => (
                          <option key={quantityOption} value={quantityOption}>
                            {quantityOption}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => removeItem(cartItem.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="summary-card summary-card--marketplace">
          <p className="eyebrow">Order summary</p>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
          </div>
          <div className="summary-row">
            <span>Estimated tax</span>
            <strong>{formatCurrency(tax)}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button
            type="button"
            className="button button--primary button--full"
            disabled={items.length === 0}
          >
            Place order
          </button>
          <p className="summary-note">
            Demo checkout only. Connect payment and shipping providers when you are ready.
          </p>
        </aside>
      </div>
    </main>
  );
}
