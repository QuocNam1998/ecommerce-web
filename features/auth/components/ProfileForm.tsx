"use client";

import { FormEvent, useState } from "react";
import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";
import { updateProfile } from "../services";
import { isEmailLike, isPhoneLike } from "../utils/authFormValidation";
import { useTranslations } from "@/lib/i18n/I18nProvider";

type ProfileFormProps = {
  user: AuthenticatedUser;
  onUpdated: (user: AuthenticatedUser) => void;
};

export function ProfileForm({ user, onUpdated }: ProfileFormProps) {
  const t = useTranslations("account");

  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const displayNameError =
    displayName.trim().length === 0
      ? t("profileDisplayNameRequired")
      : displayName.trim().length < 2
        ? t("profileDisplayNameTooShort")
        : "";

  const emailError =
    email.trim().length === 0
      ? t("profileEmailRequired")
      : !isEmailLike(email)
        ? t("profileEmailInvalid")
        : "";

  const phoneError =
    phone.trim().length > 0 && !isPhoneLike(phone)
      ? t("profilePhoneInvalid")
      : "";

  const hasValidationError = Boolean(displayNameError || emailError || phoneError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (hasValidationError) {
      return;
    }

    const changed: { displayName?: string; email?: string; phone?: string } = {};
    if (displayName.trim() !== user.displayName) {
      changed.displayName = displayName.trim();
    }
    if (email.trim() !== user.email) {
      changed.email = email.trim();
    }
    const phoneValue = phone.trim() || undefined;
    const originalPhone = user.phone ?? undefined;
    if (phoneValue !== originalPhone) {
      changed.phone = phoneValue;
    }

    if (Object.keys(changed).length === 0) {
      setSuccessMessage(t("profileNoChanges"));
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await updateProfile(changed);
      onUpdated(updatedUser);
      setSuccessMessage(t("profileUpdated"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setErrorMessage(message || t("profileUpdateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label className="login-field">
        <span className="profile-form__label">{t("labelName")}</span>
        <input
          autoComplete="name"
          name="displayName"
          onChange={(event) => {
            setDisplayName(event.target.value);
            setSuccessMessage("");
          }}
          placeholder={t("labelName")}
          type="text"
          value={displayName}
        />
        {displayNameError ? (
          <span className="login-field__hint login-field__hint--error">{displayNameError}</span>
        ) : null}
      </label>

      <label className="login-field">
        <span className="profile-form__label">{t("labelEmail")}</span>
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            setSuccessMessage("");
          }}
          placeholder={t("labelEmail")}
          type="text"
          value={email}
        />
        {emailError ? (
          <span className="login-field__hint login-field__hint--error">{emailError}</span>
        ) : null}
      </label>

      <label className="login-field">
        <span className="profile-form__label">{t("labelPhone")}</span>
        <input
          autoComplete="tel"
          name="phone"
          onChange={(event) => {
            setPhone(event.target.value);
            setSuccessMessage("");
          }}
          placeholder={t("profilePhonePlaceholder")}
          type="text"
          value={phone}
        />
        {phoneError ? (
          <span className="login-field__hint login-field__hint--error">{phoneError}</span>
        ) : null}
      </label>

      {successMessage ? (
        <p className="profile-form__success">{successMessage}</p>
      ) : null}

      {errorMessage ? (
        <p className="login-error">{errorMessage}</p>
      ) : null}

      <button
        className="button button--primary"
        disabled={isSubmitting || hasValidationError}
        type="submit"
      >
        {isSubmitting ? t("profileSavePending") : t("profileSaveIdle")}
      </button>
    </form>
  );
}
