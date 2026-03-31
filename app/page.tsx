import Link from "next/link";
import {
  FeatureBand,
  ProductCard,
  fetchFeaturedProducts,
  fetchNewArrivalProducts
} from "@/features/products";
import { formatCurrency } from "@/shared/utils/formatCurrency";

const categoryHighlights = [
  "Electronics",
  "Home Living",
  "Fashion",
  "Beauty",
  "Sports",
  "Vouchers",
  "Groceries",
  "Gaming"
];

export default async function HomePage() {
  const [featuredProducts, newArrivalProducts] = await Promise.all([
    fetchFeaturedProducts(),
    fetchNewArrivalProducts()
  ]);

  return (
    <main className="marketplace-page">
      <section className="market-hero">
        <div className="market-hero__inner">
          <div className="market-hero__banner">
            <p className="market-hero__eyebrow">Mega campaign</p>
            <h1>Mid-year deals with free shipping and daily flash prices.</h1>
            <p>
              Shop an orange-marketplace style storefront with stacked promos,
              fast checkout, and curated best sellers for your home setup.
            </p>
            <div className="market-hero__actions">
              <Link className="button button--light" href="#catalog">
                Shop now
              </Link>
              <Link className="button button--ghost-light" href="/checkout">
                View cart
              </Link>
            </div>
          </div>

          <div className="market-hero__side-grid">
            <article className="market-side-card market-side-card--accent">
              <span>Voucher Pack</span>
              <strong>Save {formatCurrency(25)}</strong>
              <p>Collect bundle vouchers before checkout.</p>
            </article>
            <article className="market-side-card">
              <span>Free Shipping</span>
              <strong>Orders over {formatCurrency(150)}</strong>
              <p>Daily shipping credits on highlighted items.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="category-strip">
        <div className="category-strip__inner">
          {categoryHighlights.map((categoryHighlight) => (
            <a key={categoryHighlight} className="category-chip" href="#catalog">
              {categoryHighlight}
            </a>
          ))}
        </div>
      </section>

      <FeatureBand />

      <section className="section section--market" id="catalog">
        <div className="section__heading section__heading--market">
          <div>
            <p className="eyebrow">Flash sale</p>
            <h2>Trending deals shoppers are checking out right now.</h2>
          </div>
          <Link href="/checkout">Go to checkout</Link>
        </div>
        <div className="product-grid product-grid--market">
          {featuredProducts.map((featuredProduct) => (
            <ProductCard key={featuredProduct.id} product={featuredProduct} />
          ))}
        </div>
      </section>

      <section className="section section--market section--market-alt">
        <div className="section__heading section__heading--market">
          <div>
            <p className="eyebrow">Recommended for you</p>
            <h2>Fresh arrivals with marketplace pricing and fast dispatch.</h2>
          </div>
        </div>
        <div className="product-grid product-grid--market">
          {newArrivalProducts.map((newArrivalProduct) => (
            <ProductCard key={newArrivalProduct.id} product={newArrivalProduct} />
          ))}
        </div>
      </section>
    </main>
  );
}
