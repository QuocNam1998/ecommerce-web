"use client";

import { useState } from "react";
import type { Address } from "../types/Address";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./AddressCard.module.css";

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
};

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const t = useTranslations("addresses");
  const [confirming, setConfirming] = useState(false);

  function handleDeleteClick() {
    setConfirming(true);
  }

  function handleConfirmDelete() {
    setConfirming(false);
    onDelete(address.id);
  }

  function handleCancelDelete() {
    setConfirming(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <span className={styles.label}>{address.label}</span>
          {address.isDefault && (
            <span className={styles.defaultBadge}>{t("defaultBadge")}</span>
          )}
        </div>
        <p className={styles.line}>{address.fullName}</p>
        <p className={styles.line}>{address.street}</p>
        <p className={styles.line}>
          {address.city}
          {address.postalCode ? `, ${address.postalCode}` : ""}
        </p>
        <p className={styles.line}>{address.country}</p>
      </div>

      <div className={styles.actions}>
        {confirming ? (
          <>
            <span className={styles.confirmText}>{t("deleteConfirmText")}</span>
            <button
              className={styles.dangerButton}
              onClick={handleConfirmDelete}
              type="button"
            >
              {t("deleteConfirm")}
            </button>
            <button
              className={styles.cancelButton}
              onClick={handleCancelDelete}
              type="button"
            >
              {t("deleteCancel")}
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.editButton}
              onClick={() => onEdit(address)}
              type="button"
            >
              {t("editButton")}
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteClick}
              type="button"
            >
              {t("deleteButton")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
