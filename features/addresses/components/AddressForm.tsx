"use client";

import { FormEvent, useState } from "react";
import type { Address } from "../types/Address";
import { createAddress, updateAddress } from "../services/addressApi";
import { useTranslations } from "@/lib/i18n/I18nProvider";
import styles from "./AddressForm.module.css";

type AddressFormProps = {
  initial?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
};

type FieldErrors = Partial<Record<keyof Omit<Address, "id" | "isDefault">, string>>;

function validateFields(
  fields: Omit<Address, "id">,
  requiredMsg: (field: string) => string
): FieldErrors {
  const errors: FieldErrors = {};
  const required = ["label", "fullName", "street", "city", "country"] as const;

  for (const field of required) {
    if (!fields[field].trim()) {
      errors[field] = requiredMsg(field);
    }
  }

  return errors;
}

export function AddressForm({ initial, onSave, onCancel }: AddressFormProps) {
  const t = useTranslations("addresses");

  const [label, setLabel] = useState(initial?.label ?? "");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [street, setStreet] = useState(initial?.street ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const currentFields: Omit<Address, "id"> = {
    label,
    fullName,
    street,
    city,
    postalCode,
    country,
    isDefault,
  };

  const fieldErrors = validateFields(currentFields, () => t("fieldRequired"));
  const hasErrors = Object.keys(fieldErrors).length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      let saved: Address;
      if (initial) {
        saved = await updateAddress(initial.id, currentFields);
      } else {
        saved = await createAddress(currentFields);
      }
      onSave(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setApiError(message || t("saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formHeading}>
        {initial ? t("editHeading") : t("addHeading")}
      </h3>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>{t("fieldLabel")}</span>
        <input
          type="text"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("fieldLabelPlaceholder")}
          autoComplete="off"
        />
        {touched && fieldErrors.label && (
          <span className={styles.fieldError}>{fieldErrors.label}</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>{t("fieldFullName")}</span>
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t("fieldFullName")}
          autoComplete="name"
        />
        {touched && fieldErrors.fullName && (
          <span className={styles.fieldError}>{fieldErrors.fullName}</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>{t("fieldStreet")}</span>
        <input
          type="text"
          name="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={t("fieldStreet")}
          autoComplete="street-address"
        />
        {touched && fieldErrors.street && (
          <span className={styles.fieldError}>{fieldErrors.street}</span>
        )}
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>{t("fieldCity")}</span>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("fieldCity")}
            autoComplete="address-level2"
          />
          {touched && fieldErrors.city && (
            <span className={styles.fieldError}>{fieldErrors.city}</span>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>{t("fieldPostalCode")}</span>
          <input
            type="text"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder={t("fieldPostalCode")}
            autoComplete="postal-code"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>{t("fieldCountry")}</span>
        <input
          type="text"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder={t("fieldCountry")}
          autoComplete="country-name"
        />
        {touched && fieldErrors.country && (
          <span className={styles.fieldError}>{fieldErrors.country}</span>
        )}
      </label>

      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          name="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        <span>{t("fieldIsDefault")}</span>
      </label>

      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <div className={styles.formActions}>
        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("savePending") : t("saveIdle")}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancelButton")}
        </button>
      </div>
    </form>
  );
}
