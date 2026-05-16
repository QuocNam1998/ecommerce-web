"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="page-shell">
      <div className="empty-state">
        <p className="eyebrow">Something went wrong</p>
        <h1>We couldn&apos;t load this page.</h1>
        <p>{error.message || "Please try again."}</p>
        <button type="button" className="button button--primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
