"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cancelOrder, fetchOrderById, type Order } from "@/features/orders";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import { formatCurrency } from "@/shared/utils/formatCurrency";

function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCancelClick() {
    setError(null);
    setConfirming(true);
  }

  function handleBack() {
    setConfirming(false);
    setError(null);
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await cancelOrder(orderId);
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order.");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="cancel-order-confirm">
        <p>Are you sure? This cannot be undone.</p>
        <div className="cancel-order-confirm__actions">
          <button
            className="button button--danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Cancelling…" : "Confirm"}
          </button>
          <button
            className="button button--ghost"
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </button>
        </div>
        {error && <p className="cancel-order-confirm__error">{error}</p>}
      </div>
    );
  }

  return (
    <>
      <button className="button button--ghost" onClick={handleCancelClick}>
        Cancel order
      </button>
      {error && <p className="cancel-order-confirm__error">{error}</p>}
    </>
  );
}

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("orderConfirmation");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchOrderById(id)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell page-shell--marketplace">
        <p>{t("loading")}</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="page-shell page-shell--marketplace">
        <p>{t("notFound")}</p>
        <Link className="button button--primary" href="/">{t("continueShopping")}</Link>
      </main>
    );
  }

  return (
    <main className="page-shell page-shell--marketplace">
      <div className="order-confirmation">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1>{t("heading")}</h1>
        <p className="order-confirmation__number">
          {t("orderNumber")} <strong>#{order.id}</strong>
        </p>

        <div className="info-card info-card--marketplace">
          <div className="summary-row">
            <span>{t("statusLabel")}</span>
            <strong>{order.status}</strong>
          </div>
          <div className="summary-row">
            <span>{t("totalLabel")}</span>
            <strong>{formatCurrency(order.total)}</strong>
          </div>
          <div className="summary-row">
            <span>{t("shippingTo")}</span>
            <span>
              {order.shipName}, {order.shipAddress}, {order.shipCity}{" "}
              {order.shipPostal}, {order.shipCountry}
            </span>
          </div>
        </div>

        <div className="info-card info-card--marketplace">
          <h2>{t("itemsHeading")}</h2>
          <ul className="order-items-list">
            {order.items.map((item) => (
              <li key={item.id} className="order-item">
                <span className="order-item__name">{item.name}</span>
                <span className="order-item__qty">{t("qty")}: {item.quantity}</span>
                <span className="order-item__price">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-confirmation__actions">
          <Link className="button button--primary" href="/">
            {t("continueShopping")}
          </Link>
          <Link className="button button--ghost" href="/account">
            {t("viewOrders")}
          </Link>
          {(order.status === "pending" || order.status === "confirmed") && (
            <CancelOrderButton orderId={order.id} />
          )}
        </div>
      </div>
    </main>
  );
}
