"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../services";
import {
  getPasswordStrength,
  isEmailLike,
  isPhoneLike
} from "../utils/authFormValidation";
import { PasswordVisibilityButton } from "./PasswordVisibilityButton";
import { useTranslations } from "@/lib/i18n/I18nProvider";

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("register");
  const [displayName, setDisplayName] = useState("Modern Market Shopper");
  const [email, setEmail] = useState("new-shopper@modern-market.dev");
  const [phone, setPhone] = useState("0327130999");
  const [password, setPassword] = useState("Shopper@123");
  const [confirmPassword, setConfirmPassword] = useState("Shopper@123");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordStrength = getPasswordStrength(password);
  const displayNameError =
    displayName.trim().length === 0
      ? t("displayNameRequired")
      : displayName.trim().length < 2
        ? t("displayNameTooShort")
        : "";
  const emailError =
    email.trim().length === 0
      ? t("emailRequired")
      : !isEmailLike(email)
        ? t("emailInvalid")
        : "";
  const phoneError =
    phone.trim().length > 0 && !isPhoneLike(phone) ? t("phoneInvalid") : "";
  const passwordError =
    password.length === 0
      ? t("passwordRequired")
      : password.length < 6
        ? t("passwordTooShort")
        : "";
  const confirmPasswordError =
    confirmPassword.length === 0
      ? t("confirmPasswordRequired")
      : password !== confirmPassword
        ? t("passwordMismatch")
        : "";
  const hasValidationError = Boolean(
    displayNameError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmPasswordError
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (hasValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        displayName,
        email,
        phone,
        password
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setErrorMessage(message || t("connectionFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-field">
        <input
          autoComplete="name"
          name="displayName"
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={t("displayNamePlaceholder")}
          type="text"
          value={displayName}
        />
        {displayNameError ? (
          <span className="login-field__hint login-field__hint--error">{displayNameError}</span>
        ) : (
          <span className="login-field__hint">{t("displayNameHint")}</span>
        )}
      </label>

      <label className="login-field">
        <input
          autoComplete="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          type="email"
          value={email}
        />
        {emailError ? (
          <span className="login-field__hint login-field__hint--error">{emailError}</span>
        ) : (
          <span className="login-field__hint">{t("emailHint")}</span>
        )}
      </label>

      <label className="login-field">
        <input
          autoComplete="tel"
          name="phone"
          onChange={(event) => setPhone(event.target.value)}
          placeholder={t("phonePlaceholder")}
          type="tel"
          value={phone}
        />
        {phoneError ? (
          <span className="login-field__hint login-field__hint--error">{phoneError}</span>
        ) : (
          <span className="login-field__hint">{t("phoneHint")}</span>
        )}
      </label>

      <label className="login-field login-field--password">
        <span className="login-field__control">
          <input
            autoComplete="new-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("passwordPlaceholder")}
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
        {isSubmitting ? t("statusPending") : t("statusIdle")}
      </p>
    </form>
  );
}
