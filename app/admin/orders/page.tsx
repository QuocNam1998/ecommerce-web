import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Order, OrderStatus } from "@/features/orders/types/Order";
import { buildCommerceServiceUrl } from "@/lib/commerceService";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import styles from "./page.module.css";

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

type OrderListResponse = {
  data: Order[];
};

async function fetchAdminOrders(): Promise<{ orders: Order[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(buildCommerceServiceUrl("/admin/orders"), {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return { orders: [], error: `Failed to fetch orders (${response.status}).` };
    }

    const payload = (await response.json()) as OrderListResponse;
    return { orders: payload.data ?? [], error: null };
  } catch {
    return { orders: [], error: "Network error while fetching orders." };
  }
}

async function updateOrderStatus(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id !== "string" || !id) return;
  if (typeof status !== "string" || !status) return;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  await fetch(buildCommerceServiceUrl(`/admin/orders/${id}/status`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ status }),
  });

  revalidatePath("/admin/orders");
}

async function refundOrder(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  await fetch(buildCommerceServiceUrl(`/admin/orders/${id}/refund`), {
    method: "POST",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
  });

  revalidatePath("/admin/orders");
}

function statusClass(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return styles.statusPending;
    case "confirmed":
      return styles.statusConfirmed;
    case "shipped":
      return styles.statusShipped;
    case "delivered":
      return styles.statusDelivered;
    case "cancelled":
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
}

export default async function AdminOrdersPage() {
  const { orders, error } = await fetchAdminOrders();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Orders</h1>
      </div>

      {error && <p className={styles.errorBanner}>{error}</p>}

      {orders.length === 0 && !error ? (
        <div className={styles.tableWrapper}>
          <p className={styles.empty}>No orders found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <code className={styles.orderId}>{order.id.slice(0, 8)}</code>
                  </td>
                  <td className={styles.userId}>{order.userId}</td>
                  <td className={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.total}>{formatCurrency(order.total)}</td>
                  <td>
                    <div className={styles.actions}>
                      <form action={updateOrderStatus} className={styles.statusForm}>
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className={styles.select}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className={styles.updateButton}>
                          Update
                        </button>
                      </form>
                      {order.status === "delivered" && (
                        <form action={refundOrder}>
                          <input type="hidden" name="id" value={order.id} />
                          <button type="submit" className={styles.refundButton}>
                            Refund
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
