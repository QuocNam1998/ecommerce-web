import styles from "./loading.module.css";

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage} />
      <div className={styles.cardBody}>
        <div className={`${styles.bone} ${styles.boneShort}`} />
        <div className={`${styles.bone} ${styles.boneFull}`} />
        <div className={`${styles.bone} ${styles.boneMid}`} />
        <div className={`${styles.bone} ${styles.boneThin}`} />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <main className={styles.page}>
      <div className={`section ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={`${styles.bone} ${styles.boneSideHeading}`} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.bone} ${styles.boneSideItem}`} />
          ))}
        </aside>
        <section className={styles.content}>
          <div className={`${styles.bone} ${styles.boneResultCount}`} />
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
