import { useMemo, useSyncExternalStore } from "react";
import { getNavigationId, getPath, navigate, subscribe } from "../router";

/* Stand-in for `next/navigation` in the single-file build. */
export function useRouter() {
  const navigationId = useSyncExternalStore(subscribe, getNavigationId);
  return useMemo(
    () => ({
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true }),
      prefetch: () => {},
      back: () => window.history.back(),
      forward: () => window.history.forward(),
      refresh: () => {},
      bfcacheId: String(navigationId),
    }),
    [navigationId],
  );
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getPath);
}
