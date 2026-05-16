"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "../services";
import { useTranslations } from "@/lib/i18n/I18nProvider";

export function DeleteAccountSection() {
  const t = useTranslations("account");
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleConfirm() {
    setErrorMessage("");
    setIsDeleting(true);

    try {
      await deleteAccount();
      router.push("/");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setErrorMessage(message || t("deleteAccountFailed"));
      setIsDeleting(false);
    }
  }

  return (
    <div className="danger-zone">
      <h2 className="danger-zone__heading">{t("dangerZoneHeading")}</h2>
      <p className="danger-zone__description">{t("deleteAccountDescription")}</p>

      {!showConfirm ? (
        <button
          className="button button--danger"
          onClick={() => setShowConfirm(true)}
          type="button"
        >
          {t("deleteAccountIdle")}
        </button>
      ) : (
        <div className="danger-zone__confirm">
          <p className="danger-zone__confirm-text">{t("deleteAccountConfirmText")}</p>
          <div className="danger-zone__confirm-actions">
            <button
              className="button button--danger"
              disabled={isDeleting}
              onClick={handleConfirm}
              type="button"
            >
              {isDeleting ? t("deleteAccountPending") : t("deleteAccountConfirm")}
            </button>
            <button
              className="button button--ghost"
              disabled={isDeleting}
              onClick={() => {
                setShowConfirm(false);
                setErrorMessage("");
              }}
              type="button"
            >
              {t("deleteAccountCancel")}
            </button>
          </div>
          {errorMessage ? (
            <p className="login-error">{errorMessage}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
