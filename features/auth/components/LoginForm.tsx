"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services";
import { isEmailLike, isPhoneLike } from "../utils/authFormValidation";
import { PasswordVisibilityButton } from "./PasswordVisibilityButton";
import { useTranslations } from "@/lib/i18n/I18nProvider";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("login");
  const [identifier, setIdentifier] = useState("shopper@modern-market.dev");
  const [password, setPassword] = useState("Shopper@123");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const identifierError =
    identifier.trim().length === 0
      ? t("identifierRequired")
      : !isEmailLike(identifier) && !isPhoneLike(identifier)
        ? t("identifierInvalid")
        : "";
  const passwordError =
    password.trim().length === 0
      ? t("passwordRequired")
      : password.length < 6
        ? t("passwordTooShort")
        : "";
  const hasValidationError = Boolean(identifierError || passwordError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (hasValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        identifier,
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
          autoComplete="username"
          name="identifier"
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder={t("identifierPlaceholder")}
          type="text"
          value={identifier}
        />
        {identifierError ? (
          <span className="login-field__hint login-field__hint--error">{identifierError}</span>
        ) : (
          <span className="login-field__hint">{t("identifierHint")}</span>
        )}
      </label>

      <label className="login-field login-field--password">
        <span className="login-field__control">
          <input
            autoComplete="current-password"
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
        {passwordError ? (
          <span className="login-field__hint login-field__hint--error">{passwordError}</span>
        ) : (
          <span className="login-field__hint">{t("passwordHint")}</span>
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

      <div className="login-form__meta">
        <a href="#">{t("forgotPassword")}</a>
        <span />
      </div>
    </form>
  );
}
