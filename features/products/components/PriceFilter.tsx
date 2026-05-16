"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./PriceFilter.module.css";

type PriceFilterProps = {
  category: string;
  q: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
};

export function PriceFilter({ category, q, sort, minPrice, maxPrice }: PriceFilterProps) {
  const t = useTranslations("products");
  const router = useRouter();
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  function buildUrl(overrides: { minPrice?: string; maxPrice?: string }) {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (q) sp.set("q", q);
    if (sort) sp.set("sort", sort);
    const nextMin = overrides.minPrice ?? min;
    const nextMax = overrides.maxPrice ?? max;
    if (nextMin) sp.set("minPrice", nextMin);
    if (nextMax) sp.set("maxPrice", nextMax);
    const qs = sp.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(buildUrl({}));
  }

  function handleClear() {
    setMin("");
    setMax("");
    router.push(buildUrl({ minPrice: "", maxPrice: "" }));
  }

  const hasActiveFilter = Boolean(minPrice || maxPrice);

  return (
    <div className={styles.priceFilter}>
      <h2 className={styles.heading}>{t("priceFilter.heading")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputs}>
          <input
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder={t("priceFilter.min")}
            className={styles.input}
            aria-label={t("priceFilter.min")}
          />
          <span className={styles.separator} aria-hidden="true">—</span>
          <input
            type="number"
            min={0}
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder={t("priceFilter.max")}
            className={styles.input}
            aria-label={t("priceFilter.max")}
          />
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.applyButton}>
            {t("priceFilter.apply")}
          </button>
          {hasActiveFilter && (
            <button type="button" onClick={handleClear} className={styles.clearButton}>
              {t("priceFilter.clear")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
