"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth";
import { ProfileForm, DeleteAccountSection } from "@/features/auth";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./page.module.css";

function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export default function AccountPage() {
  const t = useTranslations("account");
  const router = useRouter();
  const { user, isLoading, refetch } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push("/login?next=/account");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="page-shell page-shell--marketplace">
        <p>{t("loading")}</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className={`page-shell page-shell--marketplace ${styles.page}`}>
      <div>
        <h1 className={styles.heading}>{t("heading")}</h1>
        <p className={styles.welcome}>
          {t("welcome").replace("{name}", user.displayName)}
        </p>
        <p className={styles.memberSince}>
          {t("memberSince")} {formatMonthYear(user.createdAt)}
        </p>
      </div>

      <div className={`info-card info-card--marketplace ${styles.card}`}>
        <h2 className={styles.cardHeading}>{t("profileHeading")}</h2>
        <ProfileForm
          user={user}
          onUpdated={() => refetch()}
        />
      </div>

      <div className={`info-card info-card--marketplace ${styles.card}`}>
        <h2 className={styles.cardHeading}>{t("linksHeading")}</h2>
        <nav className={styles.links}>
          <Link className={styles.linkItem} href="/orders">
            {t("orderHistory")}
          </Link>
          <Link className={styles.linkItem} href="/account/addresses">
            {t("addressBook")}
          </Link>
        </nav>
      </div>

      <DeleteAccountSection />
    </main>
  );
}
