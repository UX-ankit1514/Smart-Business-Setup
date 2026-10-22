/*
 * Hash router for the single-file build: "#/configure" instead of "/configure", so the prototype works
 * when opened straight from disk. Mirrors the bits of Next's router the screens rely on.
 */
type Listener = () => void;

const listeners = new Set<Listener>();
let path = parse(window.location.hash);
// Changes on push/replace only — like Next's `bfcacheId` — so back/forward restores a screen as it was.
let navigationId = 0;

function parse(hash: string): string {
  const route = hash.replace(/^#/, "").split("?")[0];
  return route.startsWith("/") ? route : "/";
}

function notify() {
  listeners.forEach((listener) => listener());
}

window.addEventListener("popstate", () => {
  path = parse(window.location.hash);
  notify();
});

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getPath = () => path;
export const getNavigationId = () => navigationId;

export function navigate(to: string, { replace = false } = {}) {
  const url = `#${to}`;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  path = parse(url);
  navigationId += 1;
  notify();
  window.scrollTo({ top: 0 });
}
