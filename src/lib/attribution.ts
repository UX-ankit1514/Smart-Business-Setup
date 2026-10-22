/*
 * Campaign attribution (PRD §11). A visit to /?utm_source=chatgpt&utm_medium=paid stores the source
 * for this browser session; it is attached to analytics events and to the simulated lead record.
 */
import type { Attribution } from "@/types";
import { readSession, STORAGE_KEYS, writeSession } from "./storage";

export function captureAttribution(search: string, path: string): Attribution | null {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source")?.trim();
  // Only a new campaign visit replaces the stored source; normal navigation keeps it.
  if (!source) return getAttribution();
  const attribution: Attribution = {
    source: source.toLowerCase(),
    medium: params.get("utm_medium")?.trim().toLowerCase() || null,
    campaign: params.get("utm_campaign")?.trim() || null,
    landingPath: path,
    capturedAt: new Date().toISOString(),
  };
  writeSession(STORAGE_KEYS.attribution, attribution);
  return attribution;
}

export function getAttribution(): Attribution | null {
  return readSession<Attribution>(STORAGE_KEYS.attribution);
}

const SOURCE_NAMES: Record<string, string> = { chatgpt: "ChatGPT" };

export function describeAttribution(attribution: Attribution | null): string {
  if (!attribution) return "Direct visit (no campaign)";
  const source = SOURCE_NAMES[attribution.source] ?? attribution.source;
  return attribution.medium ? `${source} · ${attribution.medium}` : source;
}
