"use client";

import { useState, useTransition } from "react";
import styles from "./page.module.css";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddCategoryForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNameChange(value: string) {
    setName(value);
    setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    if (!trimmedSlug) {
      setError("Slug is required.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_COMMERCE_SERVICE_URL}/categories`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: trimmedName, slug: trimmedSlug }),
          }
        );

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          setError(body.message ?? "Failed to create category.");
          return;
        }

        setName("");
        setSlug("");
        setOpen(false);
        // Trigger a full page refresh so the server component re-fetches
        window.location.reload();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  if (!open) {
    return (
      <button className={styles.addButton} onClick={() => setOpen(true)}>
        Add category
      </button>
    );
  }

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <h2 className={styles.formHeading}>New Category</h2>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cat-name">
            Name
          </label>
          <input
            id="cat-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Headphones"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="cat-slug">
            Slug
          </label>
          <input
            id="cat-slug"
            type="text"
            className={styles.input}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. headphones"
            required
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            setOpen(false);
            setName("");
            setSlug("");
            setError(null);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}
