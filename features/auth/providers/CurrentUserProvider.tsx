"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser } from "@/shared/types/AuthenticatedUser";
import { fetchCurrentUser } from "../services";

type CurrentUserContextValue = {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function useCurrentUserContext(): CurrentUserContextValue {
  const value = useContext(CurrentUserContext);
  if (value === null) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return value;
}

type FetchState =
  | { status: "loading" }
  | { status: "success"; user: AuthenticatedUser }
  | { status: "error"; message: string }
  | { status: "unauthenticated" };

type CurrentUserProviderProps = {
  children: ReactNode;
};

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" });
  const [fetchCount, dispatch] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((payload) => {
        if (!cancelled) setFetchState({ status: "success", user: payload.data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        const isUnauthenticated =
          message.includes("401") ||
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("unauthenticated");
        setFetchState(
          isUnauthenticated ? { status: "unauthenticated" } : { status: "error", message }
        );
      });

    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  function refetch() {
    setFetchState({ status: "loading" });
    dispatch();
  }

  const user =
    fetchState.status === "success" ? fetchState.user : null;
  const isLoading = fetchState.status === "loading";
  const error =
    fetchState.status === "error" ? fetchState.message : null;

  return (
    <CurrentUserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
