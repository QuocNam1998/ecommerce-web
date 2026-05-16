import Link from "next/link";
import { HomeHeroCarousel, homeHeroSlides } from "@/features/home";
import { ProductCard, fetchNewArrivalProducts } from "@/features/products";
import { getRequestLocale, getMessages } from "@/lib/i18n/server";
import styles from "./page.module.css";

const quickEntryToneClassNames = {
  blue: styles.quickEntryIconBlue,
  warm: styles.quickEntryIconWarm,
  rose: styles.quickEntryIconRose,
  gold: styles.quickEntryIconGold,
  "warm-outline": styles.quickEntryIconWarmOutline,
} as const;

export default async function HomePage() {
  const [newArrivalProducts, locale] = await Promise.all([
    fetchNewArrivalProducts(),
    getRequestLocale(),
  ]);
  const messages = getMessages(locale);
  const { home } = messages;

  return (
    <main className={styles.page}>
      <section className={styles.homeBanner}>
        <HomeHeroCarousel
          slides={homeHeroSlides}
          labels={{
            accentCopy: home.carousel.accentCopy,
            featureCard1: {
              title: home.carousel.featureCard1Title,
              value: home.carousel.featureCard1Value,
              description: home.carousel.featureCard1Description,
            },
            featureCard2: {
              title: home.carousel.featureCard2Title,
              value: home.carousel.featureCard2Value,
              description: home.carousel.featureCard2Description,
            },
          }}
        />
        <div className={styles.bannerEntry}>
          <div className={styles.homeBannerOverlay}>{home.banner.overlay}</div>
          <div className={styles.homeBannerContent}>{home.banner.content}</div>
        </div>
      </section>

      <section className={styles.quickEntry}>
        <div className={styles.quickEntryInner}>
          {home.quickEntry.items.map((item) => (
            <Link
              key={item.label}
              className={styles.quickEntryItem}
              href="/products"
            >
              <span
                className={`${styles.quickEntryIcon} ${quickEntryToneClassNames[item.tone]}`}
              >
                {item.accent}
              </span>
              <span className={styles.quickEntryLabel}>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className={`section ${styles.marketSection} ${styles.marketSectionHome}`}
        id="catalog"
      >
        <div className={styles.categoryPanel}>
          <div className={styles.categoryPanelHeader}>
            <h2>{home.categorySection.heading}</h2>
          </div>
          <div className={styles.categoryGrid}>
            {home.featuredCategories.map((category) => (
              <a
                key={category.label}
                className={styles.categoryCard}
                href={`/products?category=${encodeURIComponent(category.label)}`}
              >
                <span className={styles.categoryIconWrap} aria-hidden="true">
                  <span className={styles.categoryIcon}>{category.icon}</span>
                </span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </a>
            ))}
          </div>
          <button
            type="button"
            className={styles.categoryCarouselButton}
            aria-label={home.categorySection.viewMoreAriaLabel}
          >
            {">"}
          </button>
        </div>
      </section>

      <section
        className={`section ${styles.marketSection} ${styles.marketSectionAlt}`}
        id="recommended-products"
      >
        <div className="section__heading section__heading--market section__heading--recommend">
          <div>
            <p className="eyebrow">{home.recommendations.eyebrow}</p>
            <h2>{home.recommendations.heading}</h2>
          </div>
          <Link href="/products">{home.recommendations.viewAll}</Link>
        </div>
        <div className={styles.productGrid}>
          {newArrivalProducts.map((newArrivalProduct) => (
            <ProductCard
              key={newArrivalProduct.id}
              product={newArrivalProduct}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
