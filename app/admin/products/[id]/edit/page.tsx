import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Product } from "@/features/products/types/Product";
import { buildCommerceServiceUrl } from "@/lib/commerceService";
import { ProductEditForm } from "@/features/admin/products/components/ProductEditForm";
import { updateProductAction } from "@/features/admin/products/actions/productActions";
import type { ProductFormState } from "@/features/admin/products/actions/productActions";

type ProductDetailResponse = {
  data: Product;
};

async function fetchProductById(id: string): Promise<Product | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(buildCommerceServiceUrl(`/products/${id}`), {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as ProductDetailResponse;
  return payload.data ?? null;
}

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  async function boundUpdateAction(
    prev: ProductFormState,
    formData: FormData
  ): Promise<ProductFormState> {
    "use server";
    return updateProductAction(id, prev, formData);
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          color: "#222",
        }}
      >
        Edit product
      </h1>
      <ProductEditForm product={product} updateAction={boundUpdateAction} />
    </div>
  );
}
