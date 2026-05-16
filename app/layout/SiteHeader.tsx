"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  hasPublicCommerceServiceUrl,
  logout,
  useCurrentUser,
} from "@/features/auth";
import { useCart } from "@/features/cart";
import { useMessages, useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const router = useRouter();
  const cart = useCart();
  const messages = useMessages();
  const tHeader = useTranslations("header");
  const { user: currentUser, isLoading: isLoadingUser, refetch } = useCurrentUser();

  async function handleLogout() {
    if (hasPublicCommerceServiceUrl()) {
      await logout();
    }

    refetch();
    router.push("/");
  }

  return (
    <header className={styles.siteHeader}>
      <div className={styles.promo}>
        <div className={styles.promoInner}>
          <div className={styles.utilityLinks}>
            <a href="#">{tHeader("sellerCentre")}</a>
            <span className={styles.utilityDivider}>|</span>
            <a href="#">{tHeader("download")}</a>
            <span className={styles.utilityDivider}>|</span>
            <a href="#">{tHeader("followUs")}</a>
            <span className={styles.socialDot} aria-hidden="true" />
            <span className={styles.socialDot} aria-hidden="true" />
          </div>
          <div className={styles.utilityLinks}>
            <a href="#">{tHeader("notifications")}</a>
            <a href="#">{tHeader("help")}</a>
            <a href="#">{tHeader("language")}</a>
            {isLoadingUser ? (
              <span className={styles.profile}>...</span>
            ) : currentUser ? (
              <>
                <Link href="/account" className={styles.profile}>
                  <span className={styles.profileAvatar} aria-hidden="true" />
                  <span>{currentUser.displayName}</span>
                </Link>
                <button className={styles.profile} onClick={handleLogout} type="button">
                  {tHeader("signOut")}
                </button>
              </>
            ) : (
              <Link href="/login" className={styles.profile}>
                <span className={styles.profileAvatar} aria-hidden="true" />
                <span>{tHeader("signIn")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              S
            </span>
            <span className={styles.brandCopy}>
              <strong>{tHeader("marketplace")}</strong>
            </span>
          </Link>

          <form
            className={styles.search}
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
              router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
            }}
          >
            <div className={styles.searchBar}>
              <input
                name="q"
                aria-label={tHeader("searchAriaLabel")}
                placeholder={tHeader("searchPlaceholder")}
              />
              <button type="submit" className={styles.searchButton}>
                {tHeader("search")}
              </button>
            </div>
            <div className={styles.searchTags}>
              {messages.header.searchTags.map((tag) => (
                <a key={tag} href="#catalog">
                  {tag}
                </a>
              ))}
            </div>
          </form>

          <div className={styles.actions}>
            <Link
              href="/checkout"
              className={styles.cartLink}
              aria-label={tHeader("cart")}
            >
              <svg
                aria-hidden="true"
                className={styles.cartLinkIcon}
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 4h2l2 10h9l2-7H7"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <circle cx="10" cy="19" r="1.6" fill="currentColor" />
                <circle cx="17" cy="19" r="1.6" fill="currentColor" />
              </svg>
              <span className={styles.cartLinkCount}>{cart.itemCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
