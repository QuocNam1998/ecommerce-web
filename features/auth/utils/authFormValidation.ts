export function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isPhoneLike(value: string) {
  const normalized = value.replace(/\D/g, "");
  return normalized.length >= 9 && normalized.length <= 15;
}

export function getPasswordStrength(value: string) {
  let score = 0;

  if (value.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
    score += 1;
  }

  if (/\d/.test(value)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(value)) {
    score += 1;
  }

  if (score <= 1) {
    return "weak" as const;
  }

  if (score <= 3) {
    return "medium" as const;
  }

  return "strong" as const;
}
