import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";
import { buildPublicCommerceServiceUrl, getPublicCommerceServiceUrl } from "@/lib/commerceService";

type AuthResponse = {
  message?: string;
};

type CurrentUserResponse = {
  data: AuthenticatedUser;
};

type LoginInput = {
  identifier: string;
  password: string;
};

type RegisterInput = {
  displayName: string;
  email: string;
  phone: string;
  password: string;
};

export function hasPublicCommerceServiceUrl() {
  return Boolean(getPublicCommerceServiceUrl());
}

async function sendAuthRequest<TResponse>(
  path: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(buildPublicCommerceServiceUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const isJsonResponse = response.headers.get("content-type")?.includes("application/json");
  const payload = isJsonResponse ? ((await response.json()) as TResponse) : undefined;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return payload as TResponse;
}

export function login(input: LoginInput) {
  return sendAuthRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function register(input: RegisterInput) {
  return sendAuthRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function fetchCurrentUser() {
  return sendAuthRequest<CurrentUserResponse>("/auth/me", {
    cache: "no-store"
  });
}

export async function logout() {
  await sendAuthRequest<void>("/auth/logout", {
    method: "POST",
    headers: {}
  });
}
