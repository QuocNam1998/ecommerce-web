import type { CartItem } from "../types/CartItem.ts";

export type CartSummary = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce(
    (runningSubtotal, cartItem) =>
      runningSubtotal + cartItem.product.price * cartItem.quantity,
    0
  );
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 18;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce(
    (runningItemCount, cartItem) => runningItemCount + cartItem.quantity,
    0
  );

  return {
    itemCount,
    subtotal,
    shipping,
    tax,
    total
  };
}
