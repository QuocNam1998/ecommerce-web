import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/features/cart";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { Product } from "@/features/products/types/Product";

type ProductCardProps = {
  product: Product;
};

export async function ProductCard({ product }: ProductCardProps) {
  const locale = await getRequestLocale();
  const t = createTranslator(getMessages(locale), "products");

  return (
    <article className="product-card product-card--marketplace">
      <Link href={`/products/${product.slug}`} className="product-card__image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 960px) 100vw, 25vw"
        />
        <span className="product-card__badge">{t("productCard.mallBadge")}</span>
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__pricing">
          <strong>{formatCurrency(product.price)}</strong>
          <span>{t("productCard.freeShipping")}</span>
        </div>
        <div className="product-card__meta-row">
          <span>4.9 rating</span>
          <span>Sold 1.2k+</span>
        </div>
        <div className="product-card__actions product-card__actions--stacked">
          <Link href={`/products/${product.slug}`}>{t("productCard.viewDetails")}</Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
