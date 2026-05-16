import { ProductForm } from "@/features/admin/products/components/ProductForm";
import { createProductAction } from "@/features/admin/products/actions/productActions";

export default function NewProductPage() {
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
        Add product
      </h1>
      <ProductForm action={createProductAction} submitLabel="Create product" />
    </div>
  );
}
