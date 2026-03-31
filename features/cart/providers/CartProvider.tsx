"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { calculateCartSummary } from "../services/cartSummary";
import {
  CART_STORAGE_KEY,
  parseStoredCart,
  serializeCart
} from "../services/cartStorage";
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
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
  }, [items]);

  const { itemCount, subtotal, shipping, tax, total } = calculateCartSummary(items);

  function addItem(product: Product) {
    setItems((currentItems) => {
      for (const currentItem of currentItems) {
        if (currentItem.product.id === product.id) {
          return currentItems.map((existingItem) =>
            existingItem.product.id === product.id
              ? { ...existingItem, quantity: existingItem.quantity + 1 }
              : existingItem
          );
        }
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  }

  function removeItem(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((cartItem) => cartItem.product.id !== productId)
    );
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((currentItems) =>
      currentItems
        .map((cartItem) =>
          cartItem.product.id === productId ? { ...cartItem, quantity } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  const value = {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    addItem,
    removeItem,
    updateQuantity
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
