import { buildPublicCommerceServiceUrl } from "@/lib/commerceService";
import type { Order } from "../../orders/types/Order";
import type { CheckoutSession, ShippingAddress } from "../types/CheckoutTypes";

export async function initiateCheckout(
  items: Array<{ productId: string; quantity: number }>,
  shippingAddress: ShippingAddress
): Promise<CheckoutSession> {
  const response = await fetch(buildPublicCommerceServiceUrl("/checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, shippingAddress }),
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Failed to initiate checkout.");
  }

  return response.json() as Promise<CheckoutSession>;
}

export async function confirmPayment(
  orderId: string,
  paymentDetails?: Record<string, unknown>
): Promise<Order> {
  const response = await fetch(
    buildPublicCommerceServiceUrl(`/checkout/${orderId}/pay`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentDetails ?? {}),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Failed to confirm payment.");
  }

  return response.json() as Promise<Order>;
}
