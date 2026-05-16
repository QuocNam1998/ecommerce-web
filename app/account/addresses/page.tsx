"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import { fetchAddresses, deleteAddress } from "@/features/addresses";
import type { Address } from "@/features/addresses";
import { AddressCard, AddressForm } from "@/features/addresses";
import styles from "./page.module.css";

type FormMode =
  | { type: "hidden" }
  | { type: "create" }
  | { type: "edit"; address: Address };

export default function AddressesPage() {
  const t = useTranslations("addresses");
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>({ type: "hidden" });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchAddresses()
      .then((data) => {
        setAddresses(data);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        const status =
          error instanceof Error && "status" in error
            ? (error as Error & { status: number }).status
            : undefined;

        if (status === 401) {
          router.push("/login?next=/account/addresses");
        } else {
          setIsLoading(false);
        }
      });
  }, [router]);

  function handleAddClick() {
    setFormMode({ type: "create" });
    setDeleteError("");
  }

  function handleEdit(address: Address) {
    setFormMode({ type: "edit", address });
    setDeleteError("");
  }

  function handleCancel() {
    setFormMode({ type: "hidden" });
  }

  function handleSave(saved: Address) {
    if (formMode.type === "edit") {
      setAddresses((prev) =>
        prev.map((a) => (a.id === saved.id ? saved : a))
      );
    } else {
      setAddresses((prev) => [...prev, saved]);
    }
    setFormMode({ type: "hidden" });
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteError("");
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setDeleteError(message || t("deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="page-shell page-shell--marketplace">
        <p>{t("loading")}</p>
      </main>
    );
  }

  const showForm = formMode.type !== "hidden";

  return (
    <main className={`page-shell page-shell--marketplace ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{t("heading")}</h1>
        {!showForm && (
          <button
            className="button button--primary"
            onClick={handleAddClick}
            type="button"
          >
            {t("addButton")}
          </button>
        )}
      </div>

      {showForm && (
        <div className={`info-card info-card--marketplace ${styles.formCard}`}>
          <AddressForm
            initial={formMode.type === "edit" ? formMode.address : undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {deleteError && <p className={styles.deleteError}>{deleteError}</p>}

      {!showForm && addresses.length === 0 ? (
        <p className={styles.emptyState}>{t("emptyState")}</p>
      ) : (
        <div className={styles.list}>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={
                deletingId === address.id ? styles.deletingItem : undefined
              }
            >
              <AddressCard
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
