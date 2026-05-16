import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/features/cart";
import { fetchProductBySlug, fetchProductSlugs } from "@/features/products";
import { getMessages, getRequestLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const productSlugs = await fetchProductSlugs();
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return { title: "Product not found | Modern Market" };
  }

  return {
    title: `${product.name} | Modern Market`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, locale] = await Promise.all([fetchProductBySlug(slug), getRequestLocale()]);

  if (!product) {
    notFound();
  }

  const t = createTranslator(getMessages(locale), "products");

  return (
    <main className="page-shell page-shell--marketplace">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li><Link href="/">{t("breadcrumb.home")}</Link></li>
          <li>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
          </li>
          <li>{product.name}</li>
        </ol>
      </nav>

      <div className="product-detail product-detail--marketplace">
        <div className="product-detail__gallery-card">
          <div className="product-detail__image">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="product-detail__gallery-notes">
            <span>{t("detail.officialStore")}</span>
            <span>{t("detail.returns")}</span>
            <span>{t("detail.secureCheckout")}</span>
          </div>
        </div>

        <div className="product-detail__content product-detail__content--marketplace">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-detail__stats-row">
            <span>4.9 {t("detail.ratings")}</span>
            <span>1.2k {t("detail.sold")}</span>
            <span>{t("detail.brandVoucher")}</span>
          </div>
          <div className="product-detail__price-panel">
            <p className="product-detail__price">{formatCurrency(product.price)}</p>
            <span>{t("detail.freeShipping")}</span>
          </div>
          <p className="product-detail__description">{product.description}</p>

          <div className="tag-row">
            {product.highlights.map((highlight) => (
              <span key={highlight} className="tag">{highlight}</span>
            ))}
          </div>

          <div className="info-card info-card--marketplace">
            <h2>{t("detail.whatsIncluded")}</h2>
            <ul>
              {product.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-detail__actions product-detail__actions--marketplace">
            <AddToCartButton product={product} />
            <Link className="button button--ghost" href="/checkout">
              Buy now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
