import Link from "next/link";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { PriceFilter } from "./PriceFilter";
import styles from "./CategorySidebar.module.css";

type CategorySidebarProps = {
  categories: string[];
  activeCategory: string | null;
  q?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

function buildCategoryHref(
  category: string | null,
  q: string | undefined,
  sort: string | undefined
): string {
  const sp = new URLSearchParams();
  if (category) sp.set("category", category);
  if (q) sp.set("q", q);
  if (sort) sp.set("sort", sort);
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

export async function CategorySidebar({
  categories,
  activeCategory,
  q,
  sort,
  minPrice,
  maxPrice,
}: CategorySidebarProps) {
  const locale = await getRequestLocale();
  const t = createTranslator(getMessages(locale), "products");

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>{t("categorySidebar.heading")}</h2>
      <ul className={styles.list}>
        <li>
          <Link
            href={buildCategoryHref(null, q, sort)}
            className={`${styles.item} ${!activeCategory ? styles.itemActive : ""}`}
          >
            {t("categorySidebar.all")}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={buildCategoryHref(category, q, sort)}
              className={`${styles.item} ${activeCategory === category ? styles.itemActive : ""}`}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
      <PriceFilter
        category={activeCategory ?? ""}
        q={q ?? ""}
        sort={sort ?? ""}
        minPrice={minPrice ?? ""}
        maxPrice={maxPrice ?? ""}
      />
    </aside>
  );
}
