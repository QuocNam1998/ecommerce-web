import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";
import { buildCommerceServiceUrl } from "@/lib/commerceService";
import styles from "./layout.module.css";

type CurrentUserResponse = {
  data: AuthenticatedUser;
};

async function fetchAdminUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(buildCommerceServiceUrl("/auth/me"), {
      credentials: "include",
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as CurrentUserResponse;
    return payload.data ?? null;
  } catch {
    return null;
  }
}

const NAV_LINKS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchAdminUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.sidebar}>
        <p className={styles.sidebarTitle}>Admin</p>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.navLink}>
            {link.label}
          </Link>
        ))}
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
