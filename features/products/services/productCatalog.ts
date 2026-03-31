import type { Product } from "../types/Product.ts";
import { products } from "./productData.ts";

const productById = new Map(products.map((product) => [product.id, product]));
const productBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 3);
}

export function getNewArrivalProducts(): Product[] {
  return products.slice(3);
}

export function getProductById(productId: string): Product | undefined {
  return productById.get(productId);
}

export function getProductBySlug(productSlug: string): Product | undefined {
  return productBySlug.get(productSlug);
}

export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}
