import type { Product } from "@/features/products/types/Product";

export type CartItem = {
  product: Product;
  quantity: number;
};
