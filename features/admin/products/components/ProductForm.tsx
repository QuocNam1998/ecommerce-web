"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ProductFormState } from "../actions/productActions";
import { INITIAL_PRODUCT_FORM_STATE } from "../actions/productActions";

type ProductFormProps = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  defaultValues?: {
    name?: string;
    slug?: string;
    category?: string;
    price?: string;
    description?: string;
    image?: string;
    highlights?: string;
    includes?: string;
  };
  submitLabel?: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "0.9rem",
  background: "#fafafa",
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#d93025" }}>
      {message}
    </p>
  );
}

function FormField({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: "#555",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

export function ProductForm({
  action,
  defaultValues = {},
  submitLabel = "Save product",
}: ProductFormProps) {
  const router = useRouter();
  const slugRef = useRef<HTMLInputElement>(null);
  const slugManualRef = useRef(false);

  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_PRODUCT_FORM_STATE
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
    }
  }, [state.success, router]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugManualRef.current && slugRef.current) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  }

  function handleSlugChange() {
    slugManualRef.current = true;
  }

  return (
    <form
      action={formAction}
      style={{
        maxWidth: "640px",
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #e8e8e8",
      }}
    >
      {state.errors.form && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "#fce8e6",
            color: "#d93025",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          {state.errors.form}
        </div>
      )}

      <FormField label="Name" name="name" error={state.errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={defaultValues.name ?? ""}
          onChange={handleNameChange}
          style={inputStyle}
        />
      </FormField>

      <FormField label="Slug" name="slug" error={state.errors.slug}>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={defaultValues.slug ?? ""}
          ref={slugRef}
          onChange={handleSlugChange}
          style={inputStyle}
        />
      </FormField>

      <FormField label="Category" name="category" error={state.errors.category}>
        <input
          id="category"
          name="category"
          type="text"
          defaultValue={defaultValues.category ?? ""}
          style={inputStyle}
        />
      </FormField>

      <FormField label="Price (USD)" name="price" error={state.errors.price}>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="29.99"
          defaultValue={defaultValues.price ?? ""}
          style={inputStyle}
        />
      </FormField>

      <FormField
        label="Description"
        name="description"
        error={state.errors.description}
      >
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues.description ?? ""}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </FormField>

      <FormField label="Image URL" name="image" error={state.errors.image}>
        <input
          id="image"
          name="image"
          type="text"
          defaultValue={defaultValues.image ?? ""}
          style={inputStyle}
        />
      </FormField>

      <FormField
        label="Highlights (one per line)"
        name="highlights"
        error={state.errors.highlights}
      >
        <textarea
          id="highlights"
          name="highlights"
          rows={4}
          defaultValue={defaultValues.highlights ?? ""}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </FormField>

      <FormField
        label="Includes (one per line)"
        name="includes"
        error={state.errors.includes}
      >
        <textarea
          id="includes"
          name="includes"
          rows={4}
          defaultValue={defaultValues.includes ?? ""}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </FormField>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "0.6rem 1.5rem",
            background: "#ee4d2d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: 600,
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <a
          href="/admin/products"
          style={{
            padding: "0.6rem 1.25rem",
            background: "#f0f0f0",
            color: "#333",
            borderRadius: "4px",
            fontWeight: 500,
            fontSize: "0.9rem",
            textDecoration: "none",
          }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
