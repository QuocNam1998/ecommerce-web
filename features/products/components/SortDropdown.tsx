"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./SortDropdown.module.css";

type SortDropdownProps = {
  sort: string;
  category: string;
  q: string;
  minPrice: string;
  maxPrice: string;
};

export function SortDropdown({ sort, category, q, minPrice, maxPrice }: SortDropdownProps) {
  const t = useTranslations("products");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value;
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (q) sp.set("q", q);
    if (newSort) sp.set("sort", newSort);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    const qs = sp.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort-select" className={styles.label}>
        {t("sort.label")}
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">{t("sort.default")}</option>
        <option value="price_asc">{t("sort.price_asc")}</option>
        <option value="price_desc">{t("sort.price_desc")}</option>
        <option value="newest">{t("sort.newest")}</option>
      </select>
    </div>
  );
}
