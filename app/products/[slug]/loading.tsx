import styles from "./loading.module.css";

export default function ProductDetailLoading() {
  return (
    <main className="page-shell page-shell--marketplace">
      <div className={styles.breadcrumb}>
        <div className={`${styles.bone} ${styles.boneBreadcrumb}`} />
      </div>
      <div className="product-detail product-detail--marketplace">
        <div className="product-detail__gallery-card">
          <div className={styles.image} />
          <div className={styles.galleryNotes}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`${styles.bone} ${styles.boneNote}`} />
            ))}
          </div>
        </div>
        <div className="product-detail__content product-detail__content--marketplace">
          <div className={`${styles.bone} ${styles.boneEyebrow}`} />
          <div className={`${styles.bone} ${styles.boneTitle}`} />
          <div className={`${styles.bone} ${styles.boneTitleShort}`} />
          <div className={styles.statsRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`${styles.bone} ${styles.boneStat}`} />
            ))}
          </div>
          <div className={styles.pricePanel}>
            <div className={`${styles.bone} ${styles.bonePrice}`} />
            <div className={`${styles.bone} ${styles.bonePriceSub}`} />
          </div>
          <div className={`${styles.bone} ${styles.boneDesc}`} />
          <div className={`${styles.bone} ${styles.boneDescShort}`} />
          <div className={styles.actions}>
            <div className={`${styles.bone} ${styles.boneButton}`} />
            <div className={`${styles.bone} ${styles.boneButton}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
