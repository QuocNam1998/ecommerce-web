"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { resetPassword } from "../services";
import { getPasswordStrength } from "../utils/authFormValidation";
import { PasswordVisibilityButton } from "./PasswordVisibilityButton";
import { useTranslations } from "@/lib/i18n/I18nProvider";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("resetPassword");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const passwordError =
    password.length === 0
      ? t("newPasswordRequired")
      : password.length < 6
        ? t("newPasswordTooShort")
        : "";
  const confirmPasswordError =
    confirmPassword.length === 0
      ? t("confirmPasswordRequired")
      : password !== confirmPassword
        ? t("passwordMismatch")
        : "";
  const hasValidationError = Boolean(passwordError || confirmPasswordError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (hasValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setErrorMessage(message || t("connectionFailed"));
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
        <Link className="button button--primary button--full login-submit" href="/login">
          {t("backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-field login-field--password">
        <span className="login-field__control">
          <input
            autoComplete="new-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("newPasswordPlaceholder")}
            type={isPasswordVisible ? "text" : "password"}
            value={password}
          />
          <PasswordVisibilityButton
            isVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((currentValue) => !currentValue)}
          />
        </span>
        <span className="login-field__hint">{t(`passwordStrength.${passwordStrength}`)}</span>
      </label>

      <label className="login-field login-field--password">
        <span className="login-field__control">
          <input
            autoComplete="new-password"
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t("confirmPasswordPlaceholder")}
            type={isConfirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
          />
          <PasswordVisibilityButton
            isVisible={isConfirmPasswordVisible}
            onToggle={() => setIsConfirmPasswordVisible((currentValue) => !currentValue)}
          />
        </span>
        {confirmPasswordError ? (
          <span className="login-field__hint login-field__hint--error">
            {confirmPasswordError}
          </span>
        ) : (
          <span className="login-field__hint">{t("confirmPasswordHint")}</span>
        )}
      </label>

      {passwordError ? (
        <p className="login-error login-error--inline">{passwordError}</p>
      ) : null}

      {errorMessage ? <p className="login-error">{errorMessage}</p> : null}

      <button
        className="button button--primary button--full login-submit"
        disabled={isSubmitting || hasValidationError}
        type="submit"
      >
        {isSubmitting ? t("submitPending") : t("submitIdle")}
      </button>

      <p className="login-status" aria-live="polite">
        {isSubmitting ? t("submitPending") : ""}
      </p>
    </form>
  );
}
