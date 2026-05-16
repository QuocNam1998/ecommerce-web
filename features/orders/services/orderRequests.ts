import type { Order, PlaceOrderInput } from "../types/Order";

const BASE = process.env.NEXT_PUBLIC_COMMERCE_SERVICE_URL ?? "";

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const response = await fetch(`${BASE}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Failed to place order.");
  }

  const json = await response.json() as { data: Order };
  return json.data;
}

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(`${BASE}/api/v1/orders`, {
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Failed to fetch orders.");
  }

  const json = await response.json() as { data: Order[] };
  return json.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const response = await fetch(`${BASE}/api/v1/orders/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Order not found.");
  }

  const json = await response.json() as { data: Order };
  return json.data;
}

export async function cancelOrder(id: string): Promise<Order> {
  const response = await fetch(`${BASE}/api/v1/orders/${id}/cancel`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Failed to cancel order.");
  }

  const json = await response.json() as { data: Order };
  return json.data;
}
