import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { buildCommerceServiceUrl, buildPublicCommerceServiceUrl } from "@/lib/commerceService";
import AddCategoryForm from "./AddCategoryForm";
import styles from "./page.module.css";

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

type CategoryListResponse = {
  data: Category[];
};

async function fetchCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(buildCommerceServiceUrl("/categories"), {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as CategoryListResponse;
    return payload.data ?? [];
  } catch {
    return [];
  }
}

async function deleteCategory(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  await fetch(buildPublicCommerceServiceUrl(`/categories/${id}`), {
    method: "DELETE",
    credentials: "include",
    headers: {
      Cookie: cookieHeader,
    },
  });

  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Categories</h1>
      </div>

      <div className={styles.formSection}>
        <AddCategoryForm />
      </div>

      {categories.length === 0 ? (
        <div className={styles.tableWrapper}>
          <p className={styles.empty}>No categories found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <code className={styles.slug}>{category.slug}</code>
                  </td>
                  <td>{category.productCount ?? 0}</td>
                  <td>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button type="submit" className={styles.deleteButton}>
                        Delete
                      </button>
                    </form>
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
