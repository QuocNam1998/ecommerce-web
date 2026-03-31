"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, hasPublicCommerceServiceUrl, logout } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";

export function SiteHeader() {
  const router = useRouter();
  const cart = useCart();
  const tCommon = useTranslations("common");
  const tHeader = useTranslations("header");
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null,
  );
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const quickLinks = [
    tHeader("quickLinks.flashSale"),
    tHeader("quickLinks.mall"),
    tHeader("quickLinks.vouchers"),
    tHeader("quickLinks.topUp"),
    tHeader("quickLinks.shoes"),
    tHeader("quickLinks.homeDeals"),
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      if (!hasPublicCommerceServiceUrl()) {
        setCurrentUser(null);
        setIsLoadingUser(false);
        return;
      }

      try {
        if (!isMounted) {
          return;
        }

        const payload = await fetchCurrentUser();
        setCurrentUser(payload.data);
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    if (hasPublicCommerceServiceUrl()) {
      await logout();
    }

    setCurrentUser(null);
    router.refresh();
  }

  return (
    <header className="site-header">
      <div className="site-header__promo">
        <div className="site-header__promo-inner">
          <div className="site-header__utility-links">
            <a href="#">{tHeader("sellerCentre")}</a>
            <a href="#">{tHeader("download")}</a>
            <a href="#">{tHeader("followUs")}</a>
          </div>
          <div className="site-header__utility-links">
            <a href="#">{tHeader("notifications")}</a>
            <a href="#">{tHeader("help")}</a>
            {currentUser ? (
              <span>{tHeader("greeting")}, {currentUser.displayName}</span>
            ) : (
              <Link href="/login">{tHeader("login")}</Link>
            )}
            <a href="#">{tHeader("language")}</a>
          </div>
        </div>
      </div>

      <div className="site-header__main">
        <div className="site-header__inner">
          <Link href="/" className="brand brand--marketplace">
            <strong>{tCommon("storefrontName")}</strong>
            <span>{tHeader("marketplace")}</span>
          </Link>

          <div className="site-search">
            <div className="site-search__bar">
              <input
                aria-label={tHeader("searchAriaLabel")}
                defaultValue={tHeader("searchValue")}
                placeholder={tHeader("searchPlaceholder")}
              />
              <button type="button" className="site-search__button">
                {tHeader("search")}
              </button>
            </div>
            <div className="site-search__tags">
              {quickLinks.map((quickLink) => (
                <a key={quickLink} href="#catalog">
                  {quickLink}
                </a>
              ))}
            </div>
          </div>

          <div className="site-header__actions">
            {currentUser ? (
              <button
                className="cart-pill cart-pill--header cart-pill--secondary cart-pill--button"
                onClick={handleLogout}
                type="button"
              >
                {tHeader("signOut")}
              </button>
            ) : (
              <Link
                href="/login"
                className="cart-pill cart-pill--header cart-pill--secondary"
              >
                {isLoadingUser ? tHeader("account") : tHeader("signIn")}
              </Link>
            )}
            <Link href="/checkout" className="cart-pill cart-pill--header">
              {tHeader("cart")} ({cart.itemCount})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
