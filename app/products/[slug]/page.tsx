import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/features/cart";
import { fetchProductBySlug, fetchProductSlugs } from "@/features/products";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const productSlugs = await fetchProductSlugs();

  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | Modern Market"
    };
  }

  return {
    title: `${product.name} | Modern Market`,
    description: product.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell page-shell--marketplace">
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
            <span>Official store</span>
            <span>15-day returns</span>
            <span>Secure checkout</span>
          </div>
        </div>
        <div className="product-detail__content product-detail__content--marketplace">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-detail__stats-row">
            <span>4.9 ratings</span>
            <span>1.2k sold</span>
            <span>Brand voucher available</span>
          </div>
          <div className="product-detail__price-panel">
            <p className="product-detail__price">{formatCurrency(product.price)}</p>
            <span>Free shipping with marketplace voucher</span>
          </div>
          <p className="product-detail__description">{product.description}</p>

          <div className="tag-row">
            {product.highlights.map((productHighlight) => (
              <span key={productHighlight} className="tag">
                {productHighlight}
              </span>
            ))}
          </div>

          <div className="info-card info-card--marketplace">
            <h2>What&apos;s included</h2>
            <ul>
              {product.includes.map((includedItem) => (
                <li key={includedItem}>{includedItem}</li>
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
