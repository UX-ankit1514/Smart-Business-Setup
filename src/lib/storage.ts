/* sessionStorage helpers. Storage can throw (private mode, quota), so failures fall back quietly. */

export const STORAGE_KEYS = {
  journey: "arni:journey:v2",
  attribution: "arni:attribution",
  events: "arni:events",
} as const;

export function readSession<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The prototype keeps working in memory if storage is unavailable.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of Object.values(STORAGE_KEYS)) window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to clear.
  }
}
