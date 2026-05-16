import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchOrders } from "@/features/orders";
import type { Order, OrderStatus } from "@/features/orders";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import styles from "./page.module.css";

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending:   styles.statusPending,
  confirmed: styles.statusConfirmed,
  shipped:   styles.statusShipped,
  delivered: styles.statusDelivered,
  cancelled: styles.statusCancelled,
};

function formatOrderDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortId(id: string): string {
  return `#${id.slice(0, 8)}`;
}

type OrderCardProps = {
  order: Order;
  viewDetailsLabel: string;
};

function OrderCard({ order, viewDetailsLabel }: OrderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardMain}>
        <div className={styles.cardMeta}>
          <span className={styles.orderId}>{shortId(order.id)}</span>
          <span className={styles.orderDate}>{formatOrderDate(order.createdAt)}</span>
          <span className={`${styles.badge} ${STATUS_CLASS[order.status]}`}>
            {order.status}
          </span>
        </div>
        <div className={styles.cardDetails}>
          <span className={styles.total}>{formatCurrency(order.total)}</span>
          <span className={styles.itemCount}>
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
      <Link href={`/orders/${order.id}`} className={styles.viewLink}>
        {viewDetailsLabel}
      </Link>
    </div>
  );
}

export default async function OrdersPage() {
  const locale = await getRequestLocale();
  const t = createTranslator(getMessages(locale), "orders");

  let orders: Order[];
  try {
    orders = await fetchOrders();
  } catch {
    redirect("/login?next=/orders");
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{t("heading")}</h1>

        {sorted.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t("emptyState")}</p>
            <Link className="button button--primary" href="/products">
              {t("startShopping")}
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {sorted.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                viewDetailsLabel={t("viewDetails")}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
