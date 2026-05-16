"use client";

import type { Product } from "@/features/products/types/Product";
import type { ProductFormState } from "../actions/productActions";
import { ProductForm } from "./ProductForm";

type ProductEditFormProps = {
  product: Product;
  updateAction: (
    prev: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
};

export function ProductEditForm({ product, updateAction }: ProductEditFormProps) {
  const defaultValues = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: (product.price / 100).toFixed(2),
    description: product.description,
    image: product.image,
    highlights: product.highlights.join("\n"),
    includes: product.includes.join("\n"),
  };

  return (
    <ProductForm
      action={updateAction}
      defaultValues={defaultValues}
      submitLabel="Save changes"
    />
  );
}
