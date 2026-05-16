"use client";

import Link from "next/link";

export default function ProductsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="page-shell page-shell--marketplace">
      <div className="empty-state empty-state--marketplace">
        <h2>Something went wrong</h2>
        <p>We couldn&apos;t load the products. Please try again.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" className="button button--primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="button button--ghost">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
