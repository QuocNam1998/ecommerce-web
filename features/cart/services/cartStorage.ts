import type { Product } from "../../products/types/Product.ts";
import type { CartItem } from "../types/CartItem.ts";

export type StoredCartItem = {
  product: Product;
  quantity: number;
};

type StoredCart = {
  version?: number;
  items?: StoredCartItem[];
};

export const CART_STORAGE_KEY = "modern-market-cart";
export const CART_STORAGE_VERSION = 1;

function isStoredProduct(value: unknown): value is Product {
  if (value === null || typeof value !== "object") {
    return false;
  }

  return (
    "id" in value &&
    "slug" in value &&
    "name" in value &&
    "category" in value &&
    "price" in value &&
    "description" in value &&
    "image" in value &&
    "sortOrder" in value &&
    "highlights" in value &&
    "includes" in value
  );
}

export function parseStoredCart(rawCart: string | null): CartItem[] {
  if (!rawCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(rawCart) as unknown;
    const storedCartItems: StoredCartItem[] = Array.isArray(parsedCart)
      ? (parsedCart as StoredCartItem[])
      : parsedCart && typeof parsedCart === "object" && "version" in parsedCart
        ? (parsedCart as StoredCart).version === CART_STORAGE_VERSION
          ? (parsedCart as StoredCart).items ?? []
          : []
        : [];
    const cartItems: CartItem[] = [];

    for (const storedCartItem of storedCartItems) {
      if (storedCartItem.quantity <= 0 || !isStoredProduct(storedCartItem.product)) {
        continue;
      }

      cartItems.push({
        product: storedCartItem.product,
        quantity: storedCartItem.quantity
      });
    }

    return cartItems;
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]): string {
  const storedCartItems = items.map((cartItem) => ({
    product: cartItem.product,
    quantity: cartItem.quantity
  }));

  return JSON.stringify({
    version: CART_STORAGE_VERSION,
    items: storedCartItems
  });
}
