"use client";

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityButton({
  isVisible,
  onToggle
}: PasswordVisibilityButtonProps) {
  return (
    <button
      aria-label={isVisible ? "Hide password" : "Show password"}
      className="login-eye"
      onClick={onToggle}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="login-eye__icon"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        {!isVisible ? (
          <path
            d="M4.5 19.5 19.5 4.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.9"
          />
        ) : null}
      </svg>
    </button>
  );
}
