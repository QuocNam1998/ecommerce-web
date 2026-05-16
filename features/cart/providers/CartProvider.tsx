"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode
} from "react";
import { calculateCartSummary } from "../services/cartSummary";
import {
  CART_STORAGE_KEY,
  parseStoredCart,
  serializeCart
} from "../services/cartStorage";
import { addServerCartItem, fetchServerCart } from "../services/cartApi";
import type { CartItem } from "../types/CartItem";
import type { Product } from "../../products/types/Product";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartListeners = new Set<() => void>();
const EMPTY_CART_SNAPSHOT = "";

function readStoredCartSnapshot(): string {
  if (typeof window === "undefined") {
    return EMPTY_CART_SNAPSHOT;
  }

  return window.localStorage.getItem(CART_STORAGE_KEY) ?? EMPTY_CART_SNAPSHOT;
}

function emitCartStoreChange() {
  for (const listener of cartListeners) {
    listener();
  }
}

function subscribeToCartStore(listener: () => void) {
  cartListeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCartServerSnapshot(): string {
  return EMPTY_CART_SNAPSHOT;
}

function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
  emitCartStoreChange();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const storedCartSnapshot = useSyncExternalStore(
    subscribeToCartStore,
    readStoredCartSnapshot,
    getCartServerSnapshot
  );
  const items = useMemo(
    () => parseStoredCart(storedCartSnapshot || null),
    [storedCartSnapshot]
  );

  const { itemCount, subtotal, shipping, tax, total } = calculateCartSummary(items);

  function addItem(product: Product) {
    for (const currentItem of items) {
      if (currentItem.product.id === product.id) {
        writeStoredCart(
          items.map((existingItem) =>
            existingItem.product.id === product.id
              ? { ...existingItem, quantity: existingItem.quantity + 1 }
              : existingItem
          )
        );
        return;
      }
    }

    writeStoredCart([...items, { product, quantity: 1 }]);
  }

  function removeItem(productId: string) {
    writeStoredCart(items.filter((cartItem) => cartItem.product.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    writeStoredCart(
      items
        .map((cartItem) =>
          cartItem.product.id === productId ? { ...cartItem, quantity } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  function clearCart() {
    writeStoredCart([]);
  }

  useEffect(() => {
    fetchServerCart()
      .then(() => {
        const localItems = parseStoredCart(
          window.localStorage.getItem(CART_STORAGE_KEY)
        );

        if (localItems.length === 0) return;

        for (const item of localItems) {
          void addServerCartItem(item.product.id, item.quantity);
        }
      })
      .catch(() => {
        // silently ignore — server sync is best-effort
      });
  }, []);

  const value = {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return cartContext;
}
