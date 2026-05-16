"use client";

import { useCurrentUserContext } from "../providers/CurrentUserProvider";

export function useCurrentUser() {
  return useCurrentUserContext();
}
