/*
 * Simulated analytics (PRD §14). Events are kept in sessionStorage under "arni:events" — nothing is sent anywhere.
 * Inspect them in the browser console with: JSON.parse(sessionStorage.getItem("arni:events"))
 */
import { getAttribution } from "./attribution";
import { readSession, STORAGE_KEYS, writeSession } from "./storage";

export type AnalyticsEventName =
  | "discovery_started"
  | "discovery_completed"
  | "recommendation_viewed"
  | "package_selected"
  | "service_added"
  | "service_removed"
  | "lead_submitted"
  | "hq_task_completed";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  at: string;
  source: string | null;
  medium: string | null;
  properties: Record<string, string | number | boolean | null>;
}

export function track(name: AnalyticsEventName, properties: AnalyticsEvent["properties"] = {}): void {
  const attribution = getAttribution();
  const event: AnalyticsEvent = {
    name,
    at: new Date().toISOString(),
    source: attribution?.source ?? null,
    medium: attribution?.medium ?? null,
    properties,
  };
  const events = readSession<AnalyticsEvent[]>(STORAGE_KEYS.events) ?? [];
  writeSession(STORAGE_KEYS.events, [...events, event]);
  if (process.env.NODE_ENV !== "production") console.info("[analytics]", name, event);
}

export function getTrackedEvents(): AnalyticsEvent[] {
  return readSession<AnalyticsEvent[]>(STORAGE_KEYS.events) ?? [];
}
