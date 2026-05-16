"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../cart";
import { initiateCheckout, confirmPayment } from "../services/checkoutApi";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import { CHECKOUT_QUANTITY_OPTIONS } from "../constants/checkoutOptions";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type Step = "review" | "shipping";

type ShippingFields = {
  name: string;
  address: string;
  city: string;
  postal: string;
  country: string;
};

const EMPTY_SHIPPING: ShippingFields = {
  name: "",
  address: "",
  city: "",
  postal: "",
  country: "",
};

export function CheckoutPageContent() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total,
    clearCart,
  } = useCart();
  const t = useTranslations("checkout");

  const [step, setStep] = useState<Step>("review");
  const [shippingFields, setShippingFields] = useState<ShippingFields>(EMPTY_SHIPPING);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);

  function handleShippingChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setShippingFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handlePlaceOrder(event: React.FormEvent) {
    event.preventDefault();
    setOrderError(null);
    setIsPlacing(true);

    try {
      const { orderId } = await initiateCheckout(
        items.map((cartItem) => ({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
        })),
        {
          fullName: shippingFields.name,
          street: shippingFields.address,
          city: shippingFields.city,
          postalCode: shippingFields.postal,
          country: shippingFields.country,
        }
      );
      await confirmPayment(orderId);
      clearCart();
      router.push(`/orders/${orderId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("log in") || message.toLowerCase().includes("not authenticated")) {
        setLoginRequired(true);
      } else {
        setOrderError(t("orderError"));
      }
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <main className="page-shell page-shell--marketplace">
      <div className="checkout-layout checkout-layout--marketplace">
        <section className="checkout-card checkout-card--marketplace">
          <div className="section__heading section__heading--market">
            <div>
              <p className="eyebrow">{t("eyebrow")}</p>
              <h1>{t("heading")}</h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state empty-state--marketplace">
              <h2>{t("emptyHeading")}</h2>
              <p>{t("emptyDescription")}</p>
              <Link className="button button--primary" href="/">
                {t("returnToShop")}
              </Link>
            </div>
          ) : step === "review" ? (
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
                      {t("quantityLabel")}
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
                      {t("removeButton")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <form id="shipping-form" onSubmit={handlePlaceOrder} className="shipping-form">
              <h2>{t("shippingHeading")}</h2>
              {loginRequired && (
                <p className="form-error">{t("loginRequired")}</p>
              )}
              {orderError && (
                <p className="form-error">{orderError}</p>
              )}
              <label className="field">
                <span>{t("fieldFullName")}</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={shippingFields.name}
                  onChange={handleShippingChange}
                />
              </label>
              <label className="field">
                <span>{t("fieldAddress")}</span>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingFields.address}
                  onChange={handleShippingChange}
                />
              </label>
              <label className="field">
                <span>{t("fieldCity")}</span>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingFields.city}
                  onChange={handleShippingChange}
                />
              </label>
              <label className="field">
                <span>{t("fieldPostal")}</span>
                <input
                  type="text"
                  name="postal"
                  required
                  value={shippingFields.postal}
                  onChange={handleShippingChange}
                />
              </label>
              <label className="field">
                <span>{t("fieldCountry")}</span>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingFields.country}
                  onChange={handleShippingChange}
                />
              </label>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => { setOrderError(null); setLoginRequired(false); setStep("review"); }}
              >
                {t("backToCart")}
              </button>
            </form>
          )}
        </section>

        <aside className="summary-card summary-card--marketplace">
          <p className="eyebrow">{t("summaryHeading")}</p>
          <div className="summary-row">
            <span>{t("subtotal")}</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>{t("shipping")}</span>
            <strong>{shipping === 0 ? t("freeShipping") : formatCurrency(shipping)}</strong>
          </div>
          <div className="summary-row">
            <span>{t("tax")}</span>
            <strong>{formatCurrency(tax)}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>{t("total")}</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          {step === "review" ? (
            <button
              type="button"
              className="button button--primary button--full"
              disabled={items.length === 0}
              onClick={() => setStep("shipping")}
            >
              {t("continueToShipping")}
            </button>
          ) : (
            <button
              type="submit"
              form="shipping-form"
              className="button button--primary button--full"
              disabled={isPlacing}
            >
              {isPlacing ? t("placingOrder") : t("placeOrder")}
            </button>
          )}

          <p className="summary-note">{t("disclaimer")}</p>
        </aside>
      </div>
    </main>
  );
}
