import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>We couldn&apos;t find that product.</h1>
        <p>Try the main collection instead.</p>
        <Link className="button button--primary" href="/">
          Back to storefront
        </Link>
      </div>
    </main>
  );
}
