import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p>Try heading back to the storefront and continue shopping from there.</p>
        <Link className="button button--primary" href="/">
          Back to storefront
        </Link>
      </div>
    </main>
  );
}
