import styles from "./page.module.css";

function SkeletonOrderCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonMain}>
        <div className={styles.skeletonRow}>
          <div className={`${styles.bone} ${styles.boneId}`} />
          <div className={`${styles.bone} ${styles.boneDate}`} />
          <div className={`${styles.bone} ${styles.boneBadge}`} />
        </div>
        <div className={styles.skeletonRow}>
          <div className={`${styles.bone} ${styles.boneTotal}`} />
          <div className={`${styles.bone} ${styles.boneCount}`} />
        </div>
      </div>
      <div className={`${styles.bone} ${styles.boneLink}`} />
    </div>
  );
}

export default function OrdersLoading() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={`${styles.bone} ${styles.boneId}`} style={{ height: "1.5rem", width: "10rem", marginBottom: "1.5rem" }} />
        <div className={styles.list}>
          <SkeletonOrderCard />
          <SkeletonOrderCard />
          <SkeletonOrderCard />
        </div>
      </div>
    </main>
  );
}
