"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition
} from "react";
import { useCart } from "@/features/cart/providers/CartProvider";
import type { Product } from "@/features/products/types/Product";

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isPending, startPendingTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);
  const resetTimeoutIdRef = useRef<number | null>(null);

  function handleClick() {
    startPendingTransition(() => {
      addItem(product);
    });

    startTransition(() => {
      setIsAdded(true);
    });

    if (resetTimeoutIdRef.current !== null) {
      window.clearTimeout(resetTimeoutIdRef.current);
    }

    resetTimeoutIdRef.current = window.setTimeout(() => {
      setIsAdded(false);
      resetTimeoutIdRef.current = null;
    }, 1200);
  }

  useEffect(() => {
    return () => {
      if (resetTimeoutIdRef.current !== null) {
        window.clearTimeout(resetTimeoutIdRef.current);
      }
    };
  }, []);

  return (
    <button type="button" className="button button--primary" onClick={handleClick}>
      {isPending ? "Adding..." : isAdded ? "Added" : "Add to cart"}
    </button>
  );
}
