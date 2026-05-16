"use client";

import { FormEvent, useState } from "react";
import { forgotPassword } from "../services";
import { isEmailLike } from "../utils/authFormValidation";
import { useTranslations } from "@/lib/i18n/I18nProvider";

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const emailError =
    email.trim().length === 0
      ? t("emailRequired")
      : !isEmailLike(email)
        ? t("emailInvalid")
        : "";
  const hasValidationError = Boolean(emailError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (hasValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const isRateLimit =
        message.toLowerCase().includes("rate") ||
        message.toLowerCase().includes("429") ||
        message.includes("Too Many");
      setErrorMessage(
        isRateLimit ? t("rateLimitMessage") : message || t("connectionFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="login-form">
        <p className="login-status" aria-live="polite">
          {t("successMessage")}
        </p>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-field">
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          type="email"
          value={email}
        />
        {emailError && email.trim().length > 0 ? (
          <span className="login-field__hint login-field__hint--error">
            {emailError}
          </span>
        ) : (
          <span className="login-field__hint">{t("emailHint")}</span>
        )}
      </label>

      {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

      <button
        className="button button--primary button--full login-submit"
        disabled={isSubmitting || hasValidationError}
        type="submit"
      >
        {isSubmitting ? t("submitPending") : t("submitIdle")}
      </button>
    </form>
  );
}
