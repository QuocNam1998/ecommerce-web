import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";
import { buildCommerceServiceUrl } from "@/lib/commerceService";
import styles from "./page.module.css";

type UserListResponse = {
  data: AuthenticatedUser[];
};

async function fetchAdminUsers(): Promise<{ users: AuthenticatedUser[]; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(buildCommerceServiceUrl("/admin/users"), {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return { users: [], error: `Failed to fetch users (${response.status}).` };
    }

    const payload = (await response.json()) as UserListResponse;
    return { users: payload.data ?? [], error: null };
  } catch {
    return { users: [], error: "Network error while fetching users." };
  }
}

async function changeUserRole(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const role = formData.get("role");

  if (typeof id !== "string" || !id) return;
  if (role !== "customer" && role !== "admin") return;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  await fetch(buildCommerceServiceUrl(`/admin/users/${id}/role`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ role }),
  });

  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const { users, error } = await fetchAdminUsers();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Users</h1>
      </div>

      {error && <p className={styles.errorBanner}>{error}</p>}

      {users.length === 0 && !error ? (
        <div className={styles.tableWrapper}>
          <p className={styles.empty}>No users found.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td className={styles.email}>{user.email}</td>
                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? styles.roleAdmin
                          : styles.roleCustomer
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <form action={changeUserRole} className={styles.roleForm}>
                      <input type="hidden" name="id" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className={styles.select}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                      <button type="submit" className={styles.updateButton}>
                        Save
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
