import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/features/cart";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { Product } from "@/features/products/types/Product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card product-card--marketplace">
      <Link href={`/products/${product.slug}`} className="product-card__image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 960px) 100vw, 25vw"
        />
        <span className="product-card__badge">Mall</span>
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__pricing">
          <strong>{formatCurrency(product.price)}</strong>
          <span>Free shipping</span>
        </div>
        <div className="product-card__meta-row">
          <span>4.9 rating</span>
          <span>Sold 1.2k+</span>
        </div>
        <div className="product-card__actions product-card__actions--stacked">
          <Link href={`/products/${product.slug}`}>View details</Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
