import { fetchProducts, ProductCard, CategorySidebar, SortDropdown } from "@/features/products";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import styles from "./page.module.css";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ category, q, minPrice, maxPrice, sort }, locale] = await Promise.all([
    searchParams,
    getRequestLocale(),
  ]);

  const t = createTranslator(getMessages(locale), "products");
  const allProducts = await fetchProducts();

  const categories = Array.from(
    new Set(allProducts.map((p) => p.category))
  ).sort();

  let products = allProducts;

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (minPrice) {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) products = products.filter((p) => p.price >= min);
  }

  if (maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) products = products.filter((p) => p.price <= max);
  }

  if (sort === "price_asc") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    products = [...products].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const count = products.length;
  const countLabel = `${count} ${count === 1 ? t("resultSingular") : t("resultPlural")}`;
  const categoryLabel = category ? ` ${t("inCategory")} "${category}"` : "";
  const queryLabel = q ? ` ${t("searchQuery")} "${q}"` : "";

  return (
    <main className={styles.page}>
      <div className={`section ${styles.layout}`}>
        <CategorySidebar
          categories={categories}
          activeCategory={category ?? null}
          q={q}
          sort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <section className={styles.content}>
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>{countLabel}{categoryLabel}{queryLabel}</p>
            <SortDropdown
              sort={sort ?? ""}
              category={category ?? ""}
              q={q ?? ""}
              minPrice={minPrice ?? ""}
              maxPrice={maxPrice ?? ""}
            />
          </div>
          {products.length > 0 ? (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>{t("emptyState")}{categoryLabel}{queryLabel}.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
