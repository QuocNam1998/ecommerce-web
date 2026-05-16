import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Product } from "@/features/products/types/Product";
import { buildCommerceServiceUrl, buildPublicCommerceServiceUrl } from "@/lib/commerceService";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import styles from "./page.module.css";

type AdminProduct = Product & { deletedAt?: string | null };

type ProductListResponse = {
  data: AdminProduct[];
};

async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(buildCommerceServiceUrl("/products?limit=100"), {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const payload = (await response.json()) as ProductListResponse;
  return payload.data;
}

async function deleteProduct(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  await fetch(buildPublicCommerceServiceUrl(`/products/${id}`), {
    method: "DELETE",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
  });

  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await fetchAdminProducts();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Products</h1>
        <Link href="/admin/products/new" className={styles.addButton}>
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className={styles.tableWrapper}>
          <p className={styles.empty}>No products found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    {product.deletedAt ? (
                      <span className={styles.statusDeleted}>Deleted</span>
                    ) : (
                      <span className={styles.statusActive}>Active</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={styles.editLink}
                      >
                        Edit
                      </Link>
                      {!product.deletedAt && (
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className={styles.deleteButton}>
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
