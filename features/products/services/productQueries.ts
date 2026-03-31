import { cache } from "react";
import type { Product } from "../types/Product";
import { buildCommerceServiceUrl } from "@/lib/commerceService";

type ProductListResponse = {
  data: Product[];
};

type ProductDetailResponse = {
  data: Product;
};

type ProductSlugListResponse = {
  data: string[];
};

async function fetchFromCommerceService<T>(path: string): Promise<T> {
  const response = await fetch(buildCommerceServiceUrl(path), {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: 60
    }
  });

  if (!response.ok) {
    throw new Error(`Commerce service request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

const fetchAllProductsFromService = cache(async (): Promise<Product[]> => {
  const payload = await fetchFromCommerceService<ProductListResponse>("/products");
  return payload.data;
});

export const fetchProducts = cache(async (): Promise<Product[]> => {
  return fetchAllProductsFromService();
});

export const fetchFeaturedProducts = cache(async (): Promise<Product[]> => {
  const payload = await fetchFromCommerceService<ProductListResponse>("/products/featured");
  return payload.data;
});

export const fetchNewArrivalProducts = cache(async (): Promise<Product[]> => {
  const payload = await fetchFromCommerceService<ProductListResponse>("/products/new-arrivals");
  return payload.data;
});

export const fetchProductBySlug = cache(
  async (productSlug: string): Promise<Product | undefined> => {
    try {
      const payload = await fetchFromCommerceService<ProductDetailResponse>(`/products/${productSlug}`);
      return payload.data;
    } catch {
      return undefined;
    }
  }
);

export const fetchProductSlugs = cache(async (): Promise<string[]> => {
  const payload = await fetchFromCommerceService<ProductSlugListResponse>("/products/slugs");
  return payload.data;
});
